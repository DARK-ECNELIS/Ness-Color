declare type HEX = `#${string}`
declare type RGB = { r: IntRange<0, 256>; g: IntRange<0, 256>; b: IntRange<0, 256>; a?: number }
declare type HSL = { h: IntRange<0, 361>; s: IntRange<0, 101>; l: IntRange<0, 101>; a?: number }
declare type HSV = { h: IntRange<0, 361>; s: IntRange<0, 101>; v: IntRange<0, 101>; a?: number }
declare type RYB = { r: IntRange<0, 101>; y: IntRange<0, 101>; b: IntRange<0, 101>; a?: number }
declare type CMYK = { c: IntRange<0, 101>; m: IntRange<0, 101>; y: IntRange<0, 101>; k: IntRange<0, 101>; a?: number }
declare type LAB = { l: IntRange<0, 101>; a: IntRange<0, 129> | `-${IntRange<0, 129>}`; b: IntRange<0, 129> | `-${IntRange<0, 129>}`; alphat?: number}
declare type LCH = { l: IntRange<0, 101>; c: number; h: IntRange<0, 361>; alphat?: number}


declare type LUV = { l: number; u: number; v: number; Yn?: number; Xn?: number; Zn?: number; }
declare type YUV = { y: number; u: number; v: number; alphat?: number }

//  X, Y, Z : Variable, dépendant de la couleur
declare type XYZ = { x: number; y: number; z: number; a?: number}

declare type ColorType = "HEX" | "RGB" | "HSL" | "HSV" | "RYB" | "CMYK" | "LAB" | "XYZ" | "LCH" | "YUV" | "LUV";

declare type YuvSpace = "601" | "709" | "2020" | "YDbDr" | "YIQ";

// declare type InvertColor = `#${string}` | RGBColor | RGBAColor;

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N? Acc[number] : Enumerate<N, [...Acc, Acc['length']]>;
type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;


export { ColorType, HEX, RGB, HSL, HSV, RYB, CMYK, LAB, XYZ, LCH, YUV, YuvSpace, LUV };
export { default as ColorConverter } from './Managers/ColorConverter';