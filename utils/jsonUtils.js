export const cleanJsonString = (raw) => {
  let s = raw.trim();
  
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.slice(1, -1);
  }
  
  s = s.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
  
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