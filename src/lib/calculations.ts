export const calculateAlcoholGrams = (percentage: number, volumeMl: number): number => {
  // Alcohol density is approximately 0.789 g/ml
  const ALCOHOL_DENSITY = 0.789;
  
  // Convert percentage to decimal
  const alcoholDecimal = percentage / 100;
  
  // Calculate pure alcohol volume in ml
  const pureAlcoholMl = volumeMl * alcoholDecimal;
  
  // Convert to grams using density
  const alcoholGrams = pureAlcoholMl * ALCOHOL_DENSITY;
  
  return Number(alcoholGrams.toFixed(1));
};