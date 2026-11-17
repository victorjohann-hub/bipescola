import { getLocalDateString } from "../dateUtils";

describe("dateUtils", () => {
  it("deve formatar corretamente a data local para YYYY-MM-DD", () => {
    const fixedDate = new Date(2026, 10, 7, 22, 30, 0); // 7 de Novembro de 2026 às 22:30 local
    const formatted = getLocalDateString(fixedDate);
    expect(formatted).toBe("2026-11-07");
  });

  it("deve adicionar zero à esquerda para dias e meses com 1 dígito", () => {
    const singleDigitDate = new Date(2026, 0, 5, 12, 0, 0); // 5 de Janeiro de 2026
    const formatted = getLocalDateString(singleDigitDate);
    expect(formatted).toBe("2026-01-05");
  });
});
