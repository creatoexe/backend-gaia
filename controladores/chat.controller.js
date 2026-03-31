import axios from "axios";
import { sequelize } from "../config/database.js";
import { Chat, Mensaje, ContextoChat, Consultor } from "../modelos/relations.js";
import { parseAIResponse } from "../utils/jsonUtils.js";
import { buildAIRequestPayload } from "../AI/buildAIRequestPayload.js";
import { AI_PROVIDERS } from "../AI/providers.js";
import { processFiles } from "../utils/fileProcessor.js";

const TOKENS_PARA_RESUMIR = 300;
const MENSAJES_DE_CONTEXTO = 6;

// ─── Helper: obtener consultor desde el token ───────────────
const getConsultorDesdeToken = async (req) => {
  const consultor = await Consultor.findOne({ where: { email: req.user.email } });
  return consultor;
};

const llamarIA = async (mod, data_to_analyze) => {
  const { payload, provider } = buildAIRequestPayload(mod, data_to_analyze, []);
  const cfg = AI_PROVIDERS[provider];
  const { data } = await axios.post(cfg.url, payload, { headers: cfg.headers });
  const raw = cfg.extractResponse(data);
  return parseAIResponse(raw);
};

export const crearChat = async (req, res) => {
  try {
    const { titulo } = req.body;

    const consultor = await getConsultorDesdeToken(req);
    if (!consultor)
      return res.status(404).json({ ok: false, mensaje: "Consultor no encontrado." });

    const chat = await Chat.create({
      consultor_id: consultor.id,
      titulo: titulo?.trim() || "Nueva conversación",
    });

    await ContextoChat.create({ chat_id: chat.id });

    return res.status(201).json({ ok: true, mensaje: "Chat creado.", data: chat });
  } catch (err) {
    console.error("[crearChat] ERROR:", err.message);
    return res.status(500).json({ ok: false, mensaje: "Error al crear chat.", detalle: err.message });
  }
};

export const listarChats = async (req, res) => {
  try {
    const consultor = await getConsultorDesdeToken(req);
    if (!consultor)
      return res.status(404).json({ ok: false, mensaje: "Consultor no encontrado." });

    const chats = await Chat.findAll({
      where: { consultor_id: consultor.id, activo: true },
      order: [["updatedAt", "DESC"]],
    });

    return res.status(200).json({ ok: true, data: chats });
  } catch (err) {
    console.error("[listarChats]", err.message);
    return res.status(500).json({ ok: false, mensaje: "Error al listar chats.", detalle: err.message });
  }
};

export const obtenerMensajes = async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.chatId);
    if (!chat)
      return res.status(404).json({ ok: false, mensaje: "Chat no encontrado." });

    const mensajes = await Mensaje.findAll({
      where: { chat_id: req.params.chatId },
      order: [["indice_orden", "ASC"]],
    });

    const contexto = await ContextoChat.findOne({ where: { chat_id: req.params.chatId } });

    return res.status(200).json({ ok: true, data: mensajes, contexto });
  } catch (err) {
    console.error("[obtenerMensajes]", err.message);
    return res.status(500).json({ ok: false, mensaje: "Error al obtener mensajes.", detalle: err.message });
  }
};

export const eliminarChat = async (req, res) => {
  try {
    const chat = await Chat.findByPk(req.params.chatId);
    if (!chat)
      return res.status(404).json({ ok: false, mensaje: "Chat no encontrado." });

    await chat.update({ activo: false });
    return res.status(200).json({ ok: true, mensaje: "Chat desactivado." });
  } catch (err) {
    console.error("[eliminarChat]", err.message);
    return res.status(500).json({ ok: false, mensaje: "Error al eliminar chat.", detalle: err.message });
  }
};

export const enviarMensaje = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { chatId } = req.params;
const { pregunta, provider = 'claude', model = null } = req.body;

    if (!pregunta?.trim())
      return res.status(400).json({ ok: false, mensaje: "'pregunta' es obligatoria." });

    const chat = await Chat.findByPk(chatId);
    if (!chat || !chat.activo)
      return res.status(404).json({ ok: false, mensaje: "Chat no encontrado o inactivo." });

    const contexto = await ContextoChat.findOne({ where: { chat_id: chatId } });

    const mensajesRecientes = await Mensaje.findAll({
      where: { chat_id: chatId, rol: ["user", "assistant"] },
      order: [["indice_orden", "DESC"]],
      limit: MENSAJES_DE_CONTEXTO,
    });
    const historial_reciente = mensajesRecientes.reverse().map(m => ({
      rol: m.rol,
      contenido: m.contenido,
    }));

    const totalMensajes = await Mensaje.count({ where: { chat_id: chatId } });
    await Mensaje.create({
      chat_id: chatId,
      rol: "user",
      contenido: pregunta.trim(),
      indice_orden: totalMensajes,
      tokens: null,
    }, { transaction: t });

    const archivosTexto = await processFiles(req.files ?? []);

    const queryResult = await llamarIA("db_query", {
      pregunta,
      historial_reciente,
      resumen_contexto:  contexto?.resumen || null,
      archivos_contexto: archivosTexto,
      provider,   
      model,      
    });

    if (!queryResult.isValid) {
      await t.rollback();
      return res.status(422).json({ ok: false, mensaje: "La IA no pudo procesar la solicitud.", detalle: queryResult.error });
    }

    const { queryValida, razon, query } = queryResult.parsed;

    let resultados = [];
    let total_filas = 0;
    let errorEjecucion = null;

    if (queryValida && query) {
  try {
    const rows = await sequelize.query(query, { 
      type: sequelize.QueryTypes.SELECT 
    });
    resultados = rows;
    total_filas = rows.length;
  } catch (sqlErr) {
    console.error("[chatController] Error SQL:", sqlErr.message);
    errorEjecucion = sqlErr.message;
  }
}

   const answerResult = await llamarIA("db_answer", {
      pregunta_original: pregunta,
      razon_query:       razon,
      query_valida:      queryValida && !errorEjecucion,
      resultados:        resultados.slice(0, 50),
      total_filas,
      archivos_contexto: archivosTexto,
      provider,  
      model,      
    });

    if (!answerResult.isValid) {
      await t.rollback();
      return res.status(422).json({ ok: false, mensaje: "Error al formatear la respuesta.", detalle: answerResult.error });
    }

    const { respuesta, tiene_datos, sugerencias } = answerResult.parsed;

    const totalTras = totalMensajes + 1;
    await Mensaje.create({
      chat_id: chatId,
      rol: "assistant",
      contenido: respuesta,
      indice_orden: totalTras,
      tokens: null,
    }, { transaction: t });

    const nuevoAcumulado = (contexto?.tokens_acumulados || 0) + pregunta.length + respuesta.length;

    if (nuevoAcumulado > TOKENS_PARA_RESUMIR) {
      const historialCompleto = [
        ...historial_reciente,
        { rol: "user", contenido: pregunta },
        { rol: "assistant", contenido: respuesta },
      ].map(m => `[${m.rol === "user" ? "Usuario" : "Asistente"}]: ${m.contenido}`)
        .join("\n");

      let resumenGenerado = contexto?.resumen || "";
      try {
        const resumenResult = await llamarIA("db_summary", {
          historial: historialCompleto,
          resumen_anterior: contexto?.resumen || null,
          provider: "claude",
        });
        if (resumenResult.isValid) {
          resumenGenerado = resumenResult.parsed.resumen;
        }
      } catch {
        resumenGenerado = historial_reciente
          .filter(m => m.rol === "user")
          .map(m => `- ${m.contenido.slice(0, 120)}`)
          .join("\n");
      }

      await contexto.update({
        resumen: resumenGenerado,
        mensajes_resumidos: totalTras + 1,
        tokens_acumulados: 0,
      }, { transaction: t });
      console.log("[contexto] resumen generado:", resumenGenerado?.slice(0, 100));

    } else {
      await contexto.update({
        tokens_acumulados: nuevoAcumulado,
      }, { transaction: t });
    }

    if (totalMensajes === 0) {
      await chat.update(
        { titulo: pregunta.trim().slice(0, 80) },
        { transaction: t }
      );
    }

    await t.commit();

    return res.status(200).json({
      ok: true,
      respuesta,
      tiene_datos,
      sugerencias,
      debug: {
        query_generada: query || null,
        total_filas,
        error_sql: errorEjecucion,
      },
    });

  } catch (err) {
    await t.rollback();
    console.error("[enviarMensaje]", err.message);
    return res.status(500).json({ ok: false, mensaje: "Error en el flujo de chat.", detalle: err.message });
  }
};