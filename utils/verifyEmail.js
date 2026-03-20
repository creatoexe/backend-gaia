export const emailValido = (email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
