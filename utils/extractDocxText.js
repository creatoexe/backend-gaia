import mammoth from 'mammoth';

export const extractDocxText = async (fileBuffer) => {
  const { value } = await mammoth.extractRawText({ buffer: fileBuffer });
  return value;
};
