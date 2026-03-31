import XLSX from "xlsx";

export const extractExcelText = async (fileBuffer) => {
  if (!Buffer.isBuffer(fileBuffer)) {
    throw new Error('extractExcelText: se esperaba un Buffer');
  }
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  let text = '';
  workbook.SheetNames.forEach(sheetName => {
    const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    text += csv + '\n';
  });

  return text;
};
