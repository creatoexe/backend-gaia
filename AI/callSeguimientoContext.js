import axios                   from "axios";
import { buildAIRequestPayload } from "./buildAIRequestPayload.js";
import { AI_PROVIDERS }          from "./providers.js";
import { parseAIResponse }       from "../utils/jsonUtils.js";


export const callSeguimientoContext = async (mod, data_to_analyze) => {
  const { payload, provider } = buildAIRequestPayload(mod, data_to_analyze, []);
  const providerConfig        = AI_PROVIDERS[provider];

  if (!providerConfig) throw new Error(`Proveedor AI desconocido: ${provider}`);

  const { data }    = await axios.post(providerConfig.url, payload, {
    headers: providerConfig.headers,
  });

  const raw         = providerConfig.extractResponse(data);
  const { parsed }  = parseAIResponse(raw);

  return parsed; 
};
