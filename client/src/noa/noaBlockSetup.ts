import { hexToRgb } from "../util/utils";

export const GRASS_ID = 39;
export const DARK_GRASS_ID = 40;

const COLOURS = [
  // grays
  "#ffffff",
  "#cccccc",
  "#c0c0c0",
  "#999999",
  "#666666",
  "#333333",
  "#000000",
  // reds
  "#ffcccc",
  "#ff6666",
  "#ff0000",
  "#cc0000",
  "#990000",
  "#660000",
  "#330000",
  // oranges
  "#ffcc99",
  "#ff9966",
  "#ff9900",
  "#ff6600",
  "#cc6600",
  "#993300",
  "#663300",
  // yellows
  "#ffff99",
  "#ffff66",
  "#ffcc66",
  "#ffcc33",
  "#cc9933",
  "#996633",
  "#663333",
  // olives
  "#ffffcc",
  "#ffff33",
  "#ffff00",
  "#ffcc00",
  "#999900",
  "#666600",
  "#333300",
  // greens
  "#99ff99",
  "#66ff99",
  "#33ff33",
  "#33cc00",
  "#009900",
  "#006600",
  "#003300",
  // turquoises
  "#99ffff",
  "#33ffff",
  "#66cccc",
  "#00cccc",
  "#339999",
  "#336666",
  "#003333",
  // blues
  "#ccffff",
  "#66ffff",
  "#33ccff",
  "#3366ff",
  "#3333ff",
  "#000099",
  "#000066",
  // purples
  "#ccccff",
  "#9999ff",
  "#6666cc",
  "#6633ff",
  "#6600cc",
  "#333399",
  "#330099",
  // violets
  "#ffccff",
  "#ff99ff",
  "#cc66cc",
  "#cc33cc",
  "#993399",
  "#663366",
  "#330033",
];

export function setupBlocks(noa: any) {
  for (let i = 0; i < COLOURS.length; i++) {
    let hexColor = COLOURS[i];

    // Convert hex into rgb
    var bigint = parseInt(hexColor.slice(1), 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    let colorArray = [r / 255.0, g / 255.0, b / 255.0];
    noa.registry.registerMaterial(hexColor, colorArray, null);
    noa.registry.registerBlock(i + 1, { material: hexColor });
  }
}

/**
 * Returns the noa index given a color string
 * Returns air (0) if not present
 * @param hexColor #ff00bb
 */
export function getNoaBlockId(hexColor: string) {
  // TODO round to nearest color if another color is given that doesn't exist
  let inputRgb = hexToRgb(hexColor);

  // Invalid hex string means 0
  if (!inputRgb) {
    return 0;
  }

  let foundIndex = COLOURS.indexOf(hexColor);
  if (foundIndex !== -1) {
    return foundIndex + 1;
  }

  let minDistance = 1000;
  let resultIndex = 0;

  for (let i = 0; i < COLOURS.length; i++) {
    let hex = COLOURS[i];
    let rgb = hexToRgb(hex);
    if (!rgb) {
      continue;
    }

    let dist = Math.sqrt(
      Math.pow(inputRgb.r - rgb.r, 2) +
        Math.pow(inputRgb.g - rgb.g, 2) +
        Math.pow(inputRgb.b - rgb.b, 2)
    );

    if (dist < minDistance) {
      resultIndex = i + 1;
      minDistance = dist;
    }
  }

  return resultIndex;
}

/**
 * Return a random color index.
 * Does not include the air color index (0)
 */
export function getRandomColorId() {
  return Math.floor(Math.random() * COLOURS.length) + 1;
}
