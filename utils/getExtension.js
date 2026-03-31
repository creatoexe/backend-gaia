export const getExtension = (file) => {
    if (!file) return;
    return  `.${file.split('.').pop()}`
}
