// La app está orientada a Chile: los montos se muestran en pesos chilenos.
// PayPal no opera con CLP, así que el cobro se hace en su equivalente en USD.

const withThousands = (value: string, separator: string) =>
  value.replace(/\B(?=(\d{3})+(?!\d))/g, separator);

// CLP no usa decimales: 12990 → "$12.990"
export const formatCLP = (amount: number): string => {
  const rounded = Math.round(amount ?? 0);
  const sign = rounded < 0 ? "-" : "";
  return `${sign}$${withThousands(Math.abs(rounded).toString(), ".")}`;
};

// 13.6 → "US$13,60"
export const formatUSD = (amount: number): string => {
  const [integer, decimals] = (amount ?? 0).toFixed(2).split(".");
  return `US$${withThousands(integer, ".")},${decimals}`;
};

// Solo referencial: el monto definitivo lo congela la orden al crearse
export const clpToUsd = (amountClp: number, usdClp: number): number =>
  usdClp > 0 ? Math.max(0.01, Math.round((amountClp / usdClp) * 100) / 100) : 0;
