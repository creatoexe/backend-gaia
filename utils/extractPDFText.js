import pdfParse from 'pdf-parse-debugging-disabled';

export const extractPDFText = async (fileBuffer) => {
  if (!Buffer.isBuffer(fileBuffer)) {
    throw new Error('extractPDFText: se esperaba un Buffer');
  }
  const { text } = await pdfParse(fileBuffer);
  return text;
};
