// lib/color-utils.ts
export function generateThemeFromColor(hexColor: string) {
  // Simple example - you might want to use a more sophisticated color library
  // like chroma.js for better color manipulation

  const theme = {
    "--primary": hexColor,
    "--primary-foreground": getContrastColor(hexColor),
    "--ring": hexColor,
    // Add more color variations as needed
  };

  return theme;
}

function getContrastColor(hexcolor: string) {
  const r = parseInt(hexcolor.slice(1, 3), 16);
  const g = parseInt(hexcolor.slice(3, 5), 16);
  const b = parseInt(hexcolor.slice(5, 7), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#ffffff";
}
