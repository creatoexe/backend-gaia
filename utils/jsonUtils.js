export const cleanJsonString = (raw) => {
  let s = raw.trim();

  // Eliminar backticks de markdown
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');

  // Eliminar comillas externas que envuelven todo el JSON
  if (s.startsWith('"') && s.endsWith('"')) {
    try {
      s = JSON.parse(s); // desescapa el string completo
    } catch {
      s = s.slice(1, -1);
    }
  }

  // Extraer solo el objeto JSON
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    s = s.substring(start, end + 1);
  }

  return s;
};

export const parseAIResponse = (response) => {  
  try {
    const cleaned = cleanJsonString(response);
    const parsed = JSON.parse(cleaned);
    return { parsed, isValid: true };
  } catch (error) {
    return { 
      parsed: null, 
      isValid: false, 
      error: error.message 
    };
  }
};