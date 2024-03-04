import { ColorType, HEX, HSL, HSV, RGB, RYB } from "..";
import { colorCheck } from "../Function";



// interface HSV {
//     h: number;
//     s: number;
//     v: number;
// }

// interface RYB {
//     r: number;
//     y: number;
//     b: number;
// }

// Convertisseur de couleurs
export default class ColorConverter<T extends ColorType> {

    private type: T;
    private value;

    constructor({type, value} : {type: T, value: T extends "RGB"? RGB : T extends "HSL"? HSL: T extends "HSV"? HSV : T extends "RYB"? RYB : HEX}) {
        this.type = type;
        this.value = value;
    }

    public toRGB(toString?: boolean) {
        switch (this.type) {
            case "HSL":
                return this.calHslToRgb(this.value, toString);
            // case "HSV": A FAIRE
            // case "RYB": A FAIRE
            default:

                const isValidHex = colorCheck(this.value).toString().replace(/^#/, '');
                
                // Parse les composants R, G, et B
                if (isValidHex.length == 3 || isValidHex.length == 6) {
                    const bigint = parseInt(isValidHex, 16);
                    const r = (bigint >> 16) & 255;
                    const g = (bigint >> 8) & 255;
                    const b = bigint & 255;

                    if (toString) return `rgb(${r}, ${g}, ${b})`;
                    else return { r, g, b };
                } else {
                    const bigint = parseInt(isValidHex, 16);
                    const r = (bigint >> 24) & 255;
                    const g = (bigint >> 16) & 255;
                    const b = (bigint >> 8) & 255;
                    const a = parseFloat(((bigint & 255)/255).toFixed(2));

                    if (toString) return `rgba(${r}, ${g}, ${b}, ${a})`;
                    else return { r, g, b, a };
                };
        }
    }
    
    private calHslToRgb(hsl: HSL, toString?: boolean) {

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
    
        let r, g, b;
    
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

        if (a) {
            if (toString) return `rgba(${r}, ${g}, ${b}, ${a})`;
            else return { r, g, b, a };
        } else {
            if (toString) return `rgb(${r}, ${g}, ${b})`;
            else return { r, g, b };
        }
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
                
                const { r, g, b, a } = this.value;
                const alphaHex = a? Math.round(a * 255).toString(16).padStart(2, '0') : "";

                return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}${alphaHex}`;
        }
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



    
// RGB To CMYK
// RGB To LAB

    // CMJN (Cyan, Magenta, Jaune, Noir) :

    // Format : cmyk(cyan, magenta, yellow, black)
    // Exemple : cmyk(0%, 100%, 100%, 0%) (rouge pur)

    // Lab (CIELAB) :

    // Format : lab(L*, a*, b*)
    // Exemple : lab(53.24, 80.09, 67.20)
    // LCH (CIELCH) :
    


    // Format : lch(L*, chroma, hue)
    // Exemple : lch(53.24, 105.79, 39.23)
    // XYZ :
    
    // Format : xyz(x, y, z)
    // Exemple : xyz(41.24, 21.26, 1.93)
    // YUV :
    
    // Format : yuv(y, u, v)
    // Exemple : yuv(0.59, -0.28, 0.36)
    // YPbPr :
    
    // Format : ypbpr(y, pb, pr)
    // Exemple : ypbpr(0.59, -0.28, 0.36)

    public rgbToRyb(rgb: RGB): RYB {
        // Implémentation de la conversion RGB vers RYB
        // ...

        return { r: 255, y: 255, b: 255 };
    }

    public rybToRgb(ryb: RYB): RGB {
        // Implémentation de la conversion RYB vers RGB
        // ...

        return { r: 255, g: 255, b: 255 };
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