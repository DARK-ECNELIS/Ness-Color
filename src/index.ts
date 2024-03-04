declare type HEX = `#${string}`
declare type RGB = { r: number; g: number; b: number; a?: number }
declare type HSL = { h: number; s: number; l: number; a?: number; }

declare type HSV = { h: number; s: number; v: number; }

declare type RYB = { r: number; y: number; b: number; }


declare type ColorType = "HEX" | "RGB" | "HSL" | "HSV" | "RYB";

// declare type InvertColor = `#${string}` | RGBColor | RGBAColor;

export { ColorType, HEX, RGB, HSL, HSV, RYB };

export { default as ColorConverter } from './Managers/ColorConverter';