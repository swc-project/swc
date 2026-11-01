export function beforeDeclaration() {
    return new RegExp(later, "u");
}
const later = "\\p{ASCII}";

export function shadowed() {
    const later = "\\p{ASCII_Hex_Digit}";
    return new RegExp(later, "u");
}

const _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
export function emoji() {
    return new RegExp(_emoji, "u");
}

const prefix = "^\\p{ASCII}";
export const concatenated = new RegExp(prefix + "+$", "u");

export const twice = new RegExp(later + later, "u");

const inner = "\\p{ASCII_Hex_Digit}";
const outer = `^${inner}+$`;
export const composed = new RegExp(outer, "u");

export function nestedHoisting() {
    {
        function check() {
            return new RegExp(local, "u");
        }
        const local = "^\\p{ASCII_Hex_Digit}+$";
        return check();
    }
}

export function neverCalled() {
    const a = b;
    const b = a;
    return new RegExp(a, "u");
}

const flags = "u";
export const flagsConstant = RegExp("\\p{ASCII}", flags);

export function dynamic(source) {
    return new RegExp(source, "u");
}

let mutable = "\\p{ASCII}";
export const notConstant = new RegExp(mutable, "u");

export function localRegExp() {
    function RegExp(source) {
        return source;
    }
    return RegExp("\\p{ASCII}", "u") + RegExp(later, "u");
}
