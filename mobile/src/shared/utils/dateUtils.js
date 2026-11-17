/**
 * Retorna a data local formatada no padrão YYYY-MM-DD.
 * Evita o bug de fuso horário onde .toISOString().split('T')[0] converte para UTC
 * e avança o dia após as 21:00 no Brasil (GMT -3).
 *
 * @param {Date} [d=new Date()]
 * @returns {string} Data local em formato YYYY-MM-DD
 */
export const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
