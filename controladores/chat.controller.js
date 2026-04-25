import axios from "axios";
import { sequelize } from "../config/database.js";
import { Chat, Mensaje, ContextoChat, User } from "../modelos/relations.js";
import { parseAIResponse } from "../utils/jsonUtils.js";
import { buildAIRequestPayload } from "../AI/buildAIRequestPayload.js";
import { AI_PROVIDERS } from "../AI/providers.js";
import { processFiles } from "../utils/fileProcessor.js";

const TOKENS_PARA_RESUMIR  = 2000;   
const MENSAJES_DE_CONTEXTO = 10;    

const getUserDesdeToken = async (req) => {
  return User.findOne({ where: { email: req.user.email } });
};

const llamarIA = async (mod, data_to_analyze) => {
  const { payload, provider } = buildAIRequestPayload(mod, data_to_analyze, []);
  const cfg = AI_PROVIDERS[provider];
  const { data } = await axios.post(cfg.url, payload, { headers: cfg.headers });
  const raw = cfg.extractResponse(data);
  return parseAIResponse(raw);
};

// ────────────────────────────────────────────────────────────
export const crearChat = async (req, res) => {
  try {
    const { titulo } = req.body;

    const user = await getUserDesdeToken(req);
    if (!user)
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado." });

    const chat = await Chat.create({
      user_id: user.id,
      titulo:  titulo?.trim() || "Nueva conversación",
    });

    await ContextoChat.create({ chat_id: chat.id });

    return res.status(201).json({ ok: true, mensaje: "Chat creado.", data: chat });
  } catch (err) {
    console.error("[crearChat]", err.message);
    return res.status(500).json({ ok: false, mensaje: "Error al crear chat.", detalle: err.message });
  }
};

// ────────────────────────────────────────────────────────────
export const listarChats = async (req, res) => {
  try {
    const user = await getUserDesdeToken(req);
    if (!user)
      return res.status(404).json({ ok: false, mensaje: "Usuario no encontrado." });

    const chats = await Chat.findAll({
      where: { user_id: user.id, activo: true },
      order: [["updatedAt", "DESC"]],
    });

    return res.status(200).json({ ok: true, data: chats });
  } catch (err) {
    console.error("[listarChats]", err.message);
    return res.status(500).json({ ok: false, mensaje: "Error al listar chats.", detalle: err.message });
  }
};

// ────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────
export const enviarMensaje = async (req, res) => {
  try {
    const { chatId } = req.params;
    const {
      pregunta,
      provider     = "claude",
      model        = null,
      currentRoute = "/",
    } = req.body;

    if (!pregunta?.trim())
      return res.status(400).json({ ok: false, mensaje: "'pregunta' es obligatoria." });

    const [chat, contexto, mensajesRecientes, totalMensajes] = await Promise.all([
      Chat.findByPk(chatId),
      ContextoChat.findOne({ where: { chat_id: chatId } }),
      Mensaje.findAll({
        where: { chat_id: chatId, rol: ["user", "assistant"] },
        order: [["indice_orden", "DESC"]],
        limit: MENSAJES_DE_CONTEXTO,
      }),
      Mensaje.count({ where: { chat_id: chatId } }),
    ]);

    if (!chat || !chat.activo)
      return res.status(404).json({ ok: false, mensaje: "Chat no encontrado o inactivo." });

    const historial_reciente = mensajesRecientes.reverse().map((m) => ({
      rol:       m.rol,
      contenido: m.contenido,
    }));

    const intencion_pendiente = contexto?.intencion_pendiente || null;

    // ── 2. Guardar mensaje del usuario ───────────────────────
    await Mensaje.create({
      chat_id:      chatId,
      rol:          "user",
      contenido:    pregunta.trim(),
      indice_orden: totalMensajes,
      tokens:       null,
    });

    // ── 3. Procesar archivos ─────────────────────────────────
    const archivosTexto = await processFiles(req.files ?? []);

    // ── IA #1 · db_query ─────────────────────────────────────
    // Recibe historial + intención_pendiente para que, si el mensaje actual
    // son solo datos (nombre, email, etc.), infiera la acción del turno previo.
    const queryResult = await llamarIA("db_query", {
      pregunta,
      historial_reciente,
      intencion_pendiente,
      resumen_contexto:  contexto?.resumen || null,
      archivos_contexto: archivosTexto,
      provider,
      model,
    });

    if (!queryResult.isValid)
      return res.status(422).json({
        ok:      false,
        mensaje: "La IA no pudo procesar la solicitud.",
        detalle: queryResult.error,
      });

    const { queryValida, razon, query } = queryResult.parsed;

    let resultados     = [];
    let total_filas    = 0;
    let errorEjecucion = null;

    if (queryValida && query) {
      try {
        const rows  = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT });
        resultados  = rows;
        total_filas = rows.length;
      } catch (sqlErr) {
        console.error("[chatController] Error SQL:", sqlErr.message);
        errorEjecucion = sqlErr.message;
      }
    }

    // ── IA #2 · db_answer ────────────────────────────────────
    // Recibe historial + intención_pendiente para mantener coherencia.
    // Devuelve "intencion_pendiente" (nueva/actualizada o null si cerró)
    // y "resumen" solo cuando debeResumir=true.
    const tokensAcumulados = (contexto?.tokens_acumulados || 0) + pregunta.length;
    const debeResumir      = tokensAcumulados > TOKENS_PARA_RESUMIR;

    const answerResult = await llamarIA("db_answer", {
      pregunta_original: pregunta,
      current_route:     currentRoute,
      razon_query:       razon,
      query_valida:      queryValida && !errorEjecucion,
      resultados:        resultados.slice(0, 50),
      total_filas,
      archivos_contexto: archivosTexto,
      historial_reciente,
      intencion_pendiente,
      generar_resumen:   debeResumir,
      resumen_anterior:  contexto?.resumen || null,
      provider,
      model,
    });

    if (!answerResult.isValid)
      return res.status(422).json({
        ok:      false,
        mensaje: "Error al formatear la respuesta.",
        detalle: answerResult.error,
      });

    const {
      respuesta,
      tiene_datos,
      sugerencias,
      actions                  = [],
      intencion_pendiente:       nuevaIntencion = null,
      resumen:                   resumenNuevo  = null,
    } = answerResult.parsed;

    console.log("[db_answer] intencion_pendiente:", nuevaIntencion);
    if (resumenNuevo) console.log("[contexto] resumen:", resumenNuevo.slice(0, 100));

    const resumenFinal = resumenNuevo || contexto?.resumen || null;

    // ── 4. Escrituras en transacción corta ───────────────────
    const t = await sequelize.transaction();
    try {
      const totalTras = totalMensajes + 1;

      await Mensaje.create(
        {
          chat_id:      chatId,
          rol:          "assistant",
          contenido:    respuesta,
          indice_orden: totalTras,
          tokens:       null,
        },
        { transaction: t }
      );

      // Un solo update del contexto con todos los campos necesarios
      const contextoUpdate = {
        intencion_pendiente: nuevaIntencion,   // null limpia la intención si se completó
      };

      if (debeResumir) {
        contextoUpdate.resumen            = resumenFinal;
        contextoUpdate.mensajes_resumidos = totalTras + 1;
        contextoUpdate.tokens_acumulados  = 0;
      } else {
        contextoUpdate.tokens_acumulados = tokensAcumulados + respuesta.length;
      }

      await contexto.update(contextoUpdate, { transaction: t });

      if (totalMensajes === 0) {
        await chat.update(
          { titulo: pregunta.trim().slice(0, 80) },
          { transaction: t }
        );
      }

      await t.commit();
    } catch (writeErr) {
      await t.rollback();
      throw writeErr;
    }

    // ── 5. Respuesta final ───────────────────────────────────
    return res.status(200).json({
      ok: true,
      respuesta,
      tiene_datos,
      sugerencias,
      actions,
      contexto: {
        resumen:             resumenFinal,
        intencion_pendiente: nuevaIntencion,
        mensajes_resumidos:  contexto?.mensajes_resumidos ?? 0,
        tokens_acumulados:   debeResumir ? 0 : tokensAcumulados + respuesta.length,
      },
      debug: {
        query_generada: query || null,
        total_filas,
        error_sql:      errorEjecucion,
      },
    });
  } catch (err) {
    console.error("[enviarMensaje]", err.message);
    return res.status(500).json({
      ok:      false,
      mensaje: "Error en el flujo de chat.",
      detalle: err.message,
    });
  }
};