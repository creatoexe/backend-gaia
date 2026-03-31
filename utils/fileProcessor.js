import { getExtension } from "./getExtension.js";
import { handleFileUpload } from "./handleFileUpload.js";

export const processFiles = async (files) => {
  if (!files || files.length === 0) return [];
  
  const processedFiles = [];
  
  for (const file of files) {
    try {
      const ext = getExtension(file.originalname);
      const content = await handleFileUpload(file.buffer, ext);
      processedFiles.push(`--- ${file.originalname} ---\n${content}`);
    } catch (error) {
      console.error(`Error procesando archivo ${file.originalname}:`, error);
      processedFiles.push(`--- ${file.originalname} (Error al procesar) ---`);
    }
  }
  
  return processedFiles;
};
