const baseColorInput = document.getElementById("base-color");
const schemeTypeSelect = document.getElementById("scheme-type");
const paletteContainer = document.querySelector(".palette");

function hexToHSL(hex) {
  hex = hex.replace("#", "");

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Find the maximum and minimum RGB values to calculate lightness and saturation
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // Calculate Lightness (average of max and min)
  let l = (max + min) / 2;

  // If all RGB values are the same, it's a shade of gray (no hue/saturation)
  let h = 0;
  let s = 0;

  if (delta !== 0) {
    // Calculate Saturation
    // If lightness > 0.5, use different formula to avoid oversaturation
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    // Calculate Hue
    // Different formulas depending on which RGB component is dominant
    if (max === r) {
      h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / delta + 2) / 6;
    } else {
      h = ((r - g) / delta + 4) / 6;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h, s, l) {
  // Normalize values
  h = h / 360;
  s = s / 100;
  l = l / 100;

  let r, g, b;

  if (s === 0) {
    // No saturation = gray, so all RGB components are equal to lightness
    r = g = b = l;
  } else {
    const hueToRgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  // Convert RGB (0-1) to (0-255) and then to hex
  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function generateComplementary(hsl) {
  const baseColorHex = baseColorInput.value;

  return [
    baseColorHex,
    hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
    hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 20, 90)),
    hslToHex((hsl.h + 180) % 360, hsl.s, Math.max(hsl.l - 20, 20)),
    hslToHex(hsl.h, Math.max(hsl.s - 30, 20), hsl.l),
  ];
}

function generateAnalogous(hsl) {
  const baseColorHex = baseColorInput.value;

  return [
    hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h - 15 + 360) % 360, hsl.s, hsl.l),
    baseColorHex,
    hslToHex((hsl.h + 15) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
  ];
}

function generateTriadic(hsl) {
  const baseColorHex = baseColorInput.value;

  return [
    baseColorHex,
    hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
    hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 85)),
    hslToHex((hsl.h + 120) % 360, hsl.s, Math.max(hsl.l - 15, 25)),
  ];
}

function generateTetradic(hsl) {
  const baseColorHex = baseColorInput.value;

  return [
    baseColorHex,
    hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l),
    hslToHex(hsl.h, Math.max(hsl.s - 40, 10), hsl.l),
  ];
}

function generatePalette() {
  const baseColor = baseColorInput.value;
  const schemeType = schemeTypeSelect.value;

  const hsl = hexToHSL(baseColor);

  let colors;
  switch (schemeType) {
    case "complementary":
      colors = generateComplementary(hsl);
      break;
    case "analogous":
      colors = generateAnalogous(hsl);
      break;
    case "triadic":
      colors = generateTriadic(hsl);
      break;
    case "tetradic":
      colors = generateTetradic(hsl);
      break;
    default:
      colors = generateComplementary(hsl);
  }

  paletteContainer.innerHTML = "";

  colors.forEach((color) => {
    const colorBox = document.createElement("div");
    colorBox.className = "color-box";
    colorBox.style.backgroundColor = color;

    const colorText = document.createElement("span");
    colorText.className = "color-text";
    colorText.textContent = color.toUpperCase();

    colorBox.addEventListener("click", () => {
      navigator.clipboard.writeText(color);
      colorText.textContent = "Copied!";
      setTimeout(() => {
        colorText.textContent = color.toUpperCase();
      }, 1000);
    });

    colorBox.appendChild(colorText);
    paletteContainer.appendChild(colorBox);
  });
}

baseColorInput.addEventListener("input", generatePalette);

schemeTypeSelect.addEventListener("change", generatePalette);

generatePalette();
