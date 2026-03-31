import { extractPDFText } from "./extractPDFText.js";
import { extractDocxText } from "./extractDocxText.js";
import { extractExcelText } from "./extractExcelText.js";

const fileTypeHandlers = {
    ".pdf": extractPDFText,
    ".docx": extractDocxText,
    ".xlsx": extractExcelText,
  };
  
export const handleFileUpload = async (fileBuffer, extension) => {
    const handler = fileTypeHandlers[extension];
    if (!handler) throw new Error("Formato no soportado");
    return await handler(fileBuffer);
  }
