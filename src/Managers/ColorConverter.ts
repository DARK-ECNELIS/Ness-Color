import { CMYK, ColorType, HEX, HSL, HSV, LAB, LCH, LUV, RGB, RYB, XYZ, YUV, YuvSpace } from "..";
import { colorCheck } from "../Function";

// Convertisseur de couleurs
export default class ColorConverter<T extends ColorType> {

    private type: T;
    private value;

    constructor({type, value} : {type: T, value: T extends "RGB"? RGB : T extends "HSL"? HSL: T extends "HSV"? HSV : T extends "RYB"? RYB : T extends "CMYK"? CMYK : T extends "LAB"? LAB : T extends "XYZ"? XYZ : T extends "LCH"? LCH : T extends "YUV"? YUV : T extends "LUV"? LUV : HEX}) {
        this.type = type;
        this.value = value;
    }

    public toRGB() {
        switch (this.type) {
            case "HSL":
                return this.calHslToRgb(this.value);
            case "HSV":
                return this.calHsvToRgb(this.value);
            case "RYB":
                return this.calRybToRgb(this.value);
            case "CMYK":
                return this.calCmykToRgb(this.value);
            case "LAB":
                this.value = this.calLabToXyz(this.value);
                this.type = <T>"XYZ";

                return this.calXyzToRgb(this.value);
            case "LCH":
                this.value = this.calLchToLab(this.value);
                this.type = <T>"LAB"

                this.value = this.calLabToXyz(this.value);
                this.type = <T>"XYZ";

                return this.calXyzToRgb(this.value);
            case "XYZ":
                return this.calXyzToRgb(this.value);
            case "YUV":
                return this.calYuvToRgb(this.value);
            case "LUV":
                this.value = this.calLuvToXyx(this.value);
                this.type = <T>"XYZ";

                return this.calXyzToRgb(this.value);
            default:
                return this.calHexToRgb(this.value);
        }
    }
    
    private calHexToRgb(hex: HEX) {

        const isValidHex = colorCheck(hex).toString().replace(/^#/, '');
                
        // Parse les composants R, G, et B
        if (isValidHex.length == 3 || isValidHex.length == 6) {
            const bigint = parseInt(isValidHex, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;

            return { r, g, b };
        } else {
            const bigint = parseInt(isValidHex, 16);
            const r = (bigint >> 24) & 255;
            const g = (bigint >> 16) & 255;
            const b = (bigint >> 8) & 255;
            const a = parseFloat(((bigint & 255)/255).toFixed(2));

            return { r, g, b, a };
        };
    }
    private calHslToRgb(hsl: HSL) {

        const h = hsl.h / 360;
        const s = hsl.s / 100;
        const l = hsl.l / 100;
        const a = hsl.a;
    
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
    
        let r: number, g: number, b: number;
    
        if (s === 0) {
            r = g = b = l; // Achromatique
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        
        r = Math.round(r * 255), g = Math.round(g * 255), b = Math.round(b * 255)

        if (a) return { r, g, b, a };
        else return { r, g, b };
    }
    private calHsvToRgb(hsv: HSV) {
        
        const h = hsv.h / 360;
        const s = hsv.s / 100;
        const v = hsv.v / 100;
        const a = hsv.a

        let r: number, g: number, b: number;

        const i = Math.floor(h * 6);
        const f = h * 6 - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
        
        r = Math.round(r * 255), g = Math.round(g * 255), b = Math.round(b * 255)

        if (a) return { r, g, b, a };
        else return { r, g, b };
    }
    private calRybToRgb(ryb: RYB) {
        
        const r2 = ryb.r / 100;
        const y = ryb.y / 100;
        const b2 = ryb.b / 100;
        const a = ryb.a

        let r: number, g: number, b: number;
    
        r = r2 * 0.99 + y * 0.15 + b2 * 0.15;
        g = y * 0.99 + r2 * 0.15 + b2 * 0.15;
        b = b2 * 0.99 + r2 * 0.15 + y * 0.15;
        
        r = Math.round(r * 255), g = Math.round(g * 255), b = Math.round(b * 255)

        if (a) return { r, g, b, a };
        return { r, g, b };
    }
    private calCmykToRgb(cmyk: CMYK) {
        
        const c = cmyk.c / 100;
        const m = cmyk.m / 100;
        const y = cmyk.y / 100;
        const k = cmyk.k / 100;
        const a = cmyk.a

        let r: number, g: number, b: number;

        r = 1 - Math.min(1, c * (1 - k) + k);
        g = 1 - Math.min(1, m * (1 - k) + k);
        b = 1 - Math.min(1, y * (1 - k) + k);
        
        r = Math.round(r * 255), g = Math.round(g * 255), b = Math.round(b * 255)

        if (a) return { r, g, b, a };
        else return { r, g, b };
    }
    private calLabToXyz(lab: LAB) {

        const y = (lab.l + 16) / 116;
        const x = Number(lab.a) / 500 + y;
        const z = y - Number(lab.b) / 200;
        const a = lab.alphat;
    
        const fy = Math.pow(y, 3) > 0.008856 ? Math.pow(y, 3) : (y - 16 / 116) / 7.787;
        const fx = Math.pow(x, 3) > 0.008856 ? Math.pow(x, 3) : (x - 16 / 116) / 7.787;
        const fz = Math.pow(z, 3) > 0.008856 ? Math.pow(z, 3) : (z - 16 / 116) / 7.787;
    
        
        if (a) return {
            x: fx * 95.047,
            y: fy * 100.0,
            z: fz * 108.883,
            a: a
        };
        else return {
            x: fx * 95.047,
            y: fy * 100.0,
            z: fz * 108.883
        };
    }
    private calXyzToRgb(xyz: XYZ) {

        const x = xyz.x / 100.0;
        const y = xyz.y / 100.0;
        const z = xyz.z / 100.0;
        const a = xyz.a
    
        let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
        let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
        let b = x * 0.0557 + y * -0.2040 + z * 1.0570;
    
        r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
        g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
        b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;
    
        if (a) return {
            r: Math.round(Math.max(0, Math.min(1, r)) * 255),
            g: Math.round(Math.max(0, Math.min(1, g)) * 255),
            b: Math.round(Math.max(0, Math.min(1, b)) * 255),
            a: a
        };
        else return {
            r: Math.round(Math.max(0, Math.min(1, r)) * 255),
            g: Math.round(Math.max(0, Math.min(1, g)) * 255),
            b: Math.round(Math.max(0, Math.min(1, b)) * 255)
        };
    }
    private calLchToLab(lch: LCH) {
        const { l, c, h } = lch;
        const alphat = lch.alphat

        // Convertir degrés en radians
        const radian = (degree: number) => (degree * Math.PI) / 180;
    
        // Conversion LCH en Lab
        const a = c * Math.cos(radian(h));
        const b = c * Math.sin(radian(h));
    
        if (alphat) return { l, a, b, alphat }
        else return { l, a, b };
    }
    private calYuvToRgb(yuv: YUV, space?: YuvSpace) {
        const { y, u, v } = yuv;
        const alphat = yuv.alphat
        let kr: number, kg: number, kb: number;
    
        // Sélection des coefficients en fonction de l'espace YUV spécifié
        switch (space) {
            case '601':
                kr = 0.299;
                kg = 0.587;
                kb = 0.114;
                break;
            case '709':
                kr = 0.2126;
                kg = 0.7152;
                kb = 0.0722;
                break;
            case '2020':
                // Coefficients pour YUV-2020
                kr = 0.2627;
                kg = 0.6780;
                kb = 0.0593;
                break;
            case 'YDbDr':
                // Coefficients pour YDbDr
                kr = 0.701;
                kg = -0.299;
                kb = -0.194;
                break;
            case 'YIQ':
                // Coefficients pour YIQ
                kr = 0.299;
                kg = 0.595716;
                kb = 0.211456;
                break;
        }
    
        // Conversion YUV en RGB
        const r = y + kr * (v - 0.5);
        const g = y - kg * (u - 0.5) - kb * (v - 0.5);
        const b = y + kb * (u - 0.5);
    
        // Normalisation des valeurs RGB dans l'intervalle [0, 1]
        const normalize = (value: number) => Math.max(0, Math.min(1, value));
    
        if (alphat) return {
            r: normalize(r),
            g: normalize(g),
            b: normalize(b),
            a: alphat
        };
        else return {
            r: normalize(r),
            g: normalize(g),
            b: normalize(b)
        };
    }
    private calLuvToXyx(luv: LUV) {
            
        const { l, u, v } = luv;
        
        // CIE standard reference white
        const Yn = luv.Yn? luv.Yn : 1;
        const Xn = luv.Xn? luv.Xn : 0.95047;
        const Zn = luv.Zn? luv.Zn : 1.08883;

        const e = 0.008856; // Threshold for non-linear transformation

        // Calculate intermediate values
        const Y = l > 8 ? Math.pow((l + 16) / 116, 3) : (l / 903.3) * Yn;
        const u0 = (4 * Xn) / (Xn + 15 * Y + 3 * Zn);
        const v0 = (9 * Y) / (Xn + 15 * Y + 3 * Zn);

        // Calculate XYZ
        const a = (1 / 3) * ((52 * l) / (u + 13 * l * u0) - 1);
        const b = -5 * Y;
        const c = -1 / 3;
        const d = Y * ((39 * l) / (v + 13 * l * v0) - 5);

        const X = (d - b) / (a - c);
        const Z = X * a + b;

        return [X, Y, Z];
    }







    public toHEX() {
        switch (this.type) {
            case "HSL":
                this.value = this.toRGB();
                this.type = <T>"RGB";

                return this.toHEX();
            // case "HSV": A FAIRE
            // case "RYB": A FAIRE

            default:
                return this.calRgbToHex(this.value);
        }
    }

    private calRgbToHex(rgb: RGB) {
        const { r, g, b, a } = rgb;
        const alphaHex = a? Math.round(a * 255).toString(16).padStart(2, '0') : "";

        return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}${alphaHex}`;
    }


    public toHSL(toString?: boolean) {
        switch (this.type) {
            case "HEX":
                this.value = this.toRGB()
                this.type = <T>"RGB"

                return this.toHSL();

            // case "HSV": A FAIRE
            // case "RGB": A FAIRE
            // case "RYB": A FAIRE
        
            default:
                return this.calRgbToHsl(this.value, toString);
        }
    }
    
    private calRgbToHsl(rgb: RGB, toString?: boolean) {

        // Normaliser les composantes RGB pour qu'elles soient entre 0 et 1
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        const a = rgb.a;
    
    
        // Trouver le minimum et le maximum des composantes RGB
        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);
    
        // Calculer la luminosité
        const l = (min + max) / 2;
    
        // Calculer la saturation
        const s = max === min ? 0 : l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min);
    
        // Calculer la teinte
        let h: number;
    
        if (max === min) {
            h = 0; // Achromatique
        } else {
            const d = max - min;
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        if (rgb.a) {

            if (!toString) return { h: parseFloat((h * 360).toFixed(2)), s:parseFloat((s * 100).toFixed(2)), l: parseFloat((l * 100).toFixed(2)), a: a };
            else return `hsla(${parseFloat((h * 360).toFixed(2))}, ${parseFloat((s * 100).toFixed(2))}%, ${parseFloat((l * 100).toFixed(2))}%, ${a})`;
        } else {

            if (!toString) return { h: parseFloat((h * 360).toFixed(2)), s:parseFloat((s * 100).toFixed(2)), l: parseFloat((l * 100).toFixed(2)) };
            else return `hsl(${parseFloat((h * 360).toFixed(2))}, ${parseFloat((s * 100).toFixed(2))}%, ${parseFloat((l * 100).toFixed(2))}%)`;
        }
    }



    public toHSV(toString?: boolean) {
        switch (this.type) {
            // case "HEX": A FAIRE
            // case "HSV": A FAIRE
            // case "RGB": A FAIRE
            // case "RYB": A FAIRE
        
            default:
                return this.calRgbToHsv(this.value, toString);
        }
    }

    private calRgbToHsv(rgb: RGB, toString?: boolean) {
        
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        const a = rgb.a;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        let h: number, s: number, v: number;

        // Calcul de la teinte (hue)
        if (delta === 0) {
            h = 0;
        } else if (max === r) {
            h = ((g - b) / delta) % 6;
        } else if (max === g) {
            h = (b - r) / delta + 2;
        } else {
            h = (r - g) / delta + 4;
        }

        h = parseFloat(((h * 60 + 360) % 360).toFixed(2));

        // Calcul de la saturation (saturation)
        s = max === 0 ? 0 : delta / max;

        // Calcul de la valeur (value)
        v = max;
        

        if (rgb.a) {

            if (!toString) return { h: h, s:parseFloat((s * 100).toFixed(2)), v: parseFloat((v * 100).toFixed(2)), a: a };
            else return `hsva(${parseFloat((h * 360).toFixed(2))}, ${parseFloat((s * 100).toFixed(2))}%, ${parseFloat((v * 100).toFixed(2))}%, ${a})`;
        } else {

            if (!toString) return { h: h, s:parseFloat((s * 100).toFixed(2)), v: parseFloat((v * 100).toFixed(2)) };
            else return `hsv(${parseFloat((h * 360).toFixed(2))}, ${parseFloat((s * 100).toFixed(2))}%, ${parseFloat((v * 100).toFixed(2))}%)`;
        }
    }


}


    // /**
    //  * 
    //  * @param hex #FFF | #FFFF | #FFFFFF | #FFFFFFFF
    //  * @param toString true | false
    //  * @returns \{ r: 255, g: 255, b:255, a?:1 } | rgb(a)(255,255, 255, ?)
    //  */
    // public static hexToRgb(hex: `#${string}`, toString?: boolean): RGB | string {
    // }

    
    // /**
    //  * 
    //  * @param hsl \{ h: 360, s: 100, l: 100, a?: 1 }
    //  * @param toString true | false
    //  * @returns \{ r: 255, g: 255, b:255, a?:1 } | rgb(a)(255,255, 255, ?)
    //  */
    // public static hslToRgb(hsl: HSL, toString?: boolean): RGB | string {
        
    // }

    
    // /**
    //  * 
    //  * @param hsl \{ h: 360, s: 100, l: 100, a?: 1 }
    //  * @returns #FFFFFF | #FFFFFFFF
    //  */
    // public static hslToHex(hsl: HSL): string {
    // }

    
    // /**
    //  * 
    //  * @param rgb \{ r: 255, g: 255, b: 255, a?: 1}
    //  * @returns #FFFFFF | #FFFFFFFF
    //  */
    // public static rgbToHex(rgb: RGB): string {

    // }


    
    // /**
    //  * 
    //  * @param rgb 
    //  * @param toString true | false
    //  * @returns \{ h: 360, s: 100, l: 100, a?: 1 } | hsl(360, 100%, 100%, ?)
    //  */
    // public static rgbToHsl(rgb: RGB, toString?: boolean): HSL | string {
    // }

    
    // /**
    //  * 
    //  * @param hex 
    //  * @param toString true | false
    //  * @returns \{ h: 360, s: 100, l: 100 } | hsl(360, 100%, 100%)
    //  */
    // public static hexToHsl(hex: `#${string}`, toString?: boolean): HSL | string {    
    // }

    
    // public static rgbToHsv(rgb: RGB, toString?: boolean): HSV | string {
    // }