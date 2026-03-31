import axios from 'axios';
import { parseAIResponse } from '../utils/jsonUtils.js';
import { buildAIRequestPayload } from './buildAIRequestPayload.js';
import { AI_PROVIDERS } from './providers.js';
import { handleError } from './handleError.js';
import { parseMultipart } from './parseMultipart.js';

export const sendRequestToAI = async (req, res) => {
  try {
    const { fields, files } = await parseMultipart(req);

    let { mod, data_to_analyze: rawData } = fields;

    if (!rawData) return res.status(400).json({ error: 'No se recibió datos para analizar' });
    if (!mod)     return res.status(400).json({ error: 'Se requiere un modo para ejecutar la IA' });

    let data_to_analyze;
    try {
      data_to_analyze = JSON.parse(rawData);
    } catch {
      return res.status(400).json({ error: 'data_to_analyze debe ser un JSON válido' });
    }

    try {
      const { payload, provider } = buildAIRequestPayload(mod, data_to_analyze, files);
      const providerConfig = AI_PROVIDERS[provider];

      if (!providerConfig)
        return res.status(400).json({ error: `Proveedor AI desconocido: ${provider}` });

      const { data } = await axios.post(providerConfig.url, payload, {
        headers: providerConfig.headers,
      });

      const response      = providerConfig.extractResponse(data);
      const parsedResponse = parseAIResponse(response);

      let webResults = {};
      if (provider === 'claude' && data_to_analyze?.isWebSearch) {
        const toolUse   = data.content.find(i => i.type === 'server_tool_use');
        const toolResult = data.content.find(i => i.type === 'web_search_tool_result');
        webResults = {
          query:   toolUse?.input?.query || '',
          results: (toolResult?.content || []).map(r => ({
            url: r.url, title: r.title, page_age: r.page_age || null,
          })),
        };
      }

      return res.status(200).json({ response: parsedResponse.parsed, webResults });
    } catch (err) {
      return handleError(err, res, data_to_analyze?.provider || 'claude');
    }
  } catch (err) {
    return res.status(500).json({ error: 'Error interno en el controlador AI', details: err.message });
  }
};