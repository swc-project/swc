export function beforeDeclaration() {
    return new RegExp((later, "[\\u0000-\\u007F]"), "u");
}
const later = "\\p{ASCII}";
export function shadowed() {
    const later = "\\p{ASCII_Hex_Digit}";
    return new RegExp((later, "[\\u0030-\\u0039\\u0041-\\u0046\\u0061-\\u0066]"), "u");
}
const _emoji = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
export function emoji() {
    return new RegExp((_emoji, "^([\\u00A9\\u00AE\\u203C\\u2049\\u2122\\u2139\\u2194-\\u2199\\u21A9-\\u21AA\\u231A-\\u231B\\u2328\\u23CF\\u23E9-\\u23F3\\u23F8-\\u23FA\\u24C2\\u25AA-\\u25AB\\u25B6\\u25C0\\u25FB-\\u25FE\\u2600-\\u2604\\u260E\\u2611\\u2614-\\u2615\\u2618\\u261D\\u2620\\u2622-\\u2623\\u2626\\u262A\\u262E-\\u262F\\u2638-\\u263A\\u2640\\u2642\\u2648-\\u2653\\u265F-\\u2660\\u2663\\u2665-\\u2666\\u2668\\u267B\\u267E-\\u267F\\u2692-\\u2697\\u2699\\u269B-\\u269C\\u26A0-\\u26A1\\u26A7\\u26AA-\\u26AB\\u26B0-\\u26B1\\u26BD-\\u26BE\\u26C4-\\u26C5\\u26C8\\u26CE-\\u26CF\\u26D1\\u26D3-\\u26D4\\u26E9-\\u26EA\\u26F0-\\u26F5\\u26F7-\\u26FA\\u26FD\\u2702\\u2705\\u2708-\\u270D\\u270F\\u2712\\u2714\\u2716\\u271D\\u2721\\u2728\\u2733-\\u2734\\u2744\\u2747\\u274C\\u274E\\u2753-\\u2755\\u2757\\u2763-\\u2764\\u2795-\\u2797\\u27A1\\u27B0\\u27BF\\u2934-\\u2935\\u2B05-\\u2B07\\u2B1B-\\u2B1C\\u2B50\\u2B55\\u3030\\u303D\\u3297\\u3299\\u{1F004}\\u{1F02C}-\\u{1F02F}\\u{1F094}-\\u{1F09F}\\u{1F0AF}-\\u{1F0B0}\\u{1F0C0}\\u{1F0CF}-\\u{1F0D0}\\u{1F0F6}-\\u{1F0FF}\\u{1F170}-\\u{1F171}\\u{1F17E}-\\u{1F17F}\\u{1F18E}\\u{1F191}-\\u{1F19A}\\u{1F1AE}-\\u{1F1E5}\\u{1F201}-\\u{1F20F}\\u{1F21A}\\u{1F22F}\\u{1F232}-\\u{1F23A}\\u{1F23C}-\\u{1F23F}\\u{1F249}-\\u{1F25F}\\u{1F266}-\\u{1F321}\\u{1F324}-\\u{1F393}\\u{1F396}-\\u{1F397}\\u{1F399}-\\u{1F39B}\\u{1F39E}-\\u{1F3F0}\\u{1F3F3}-\\u{1F3F5}\\u{1F3F7}-\\u{1F3FA}\\u{1F400}-\\u{1F4FD}\\u{1F4FF}-\\u{1F53D}\\u{1F549}-\\u{1F54E}\\u{1F550}-\\u{1F567}\\u{1F56F}-\\u{1F570}\\u{1F573}-\\u{1F57A}\\u{1F587}\\u{1F58A}-\\u{1F58D}\\u{1F590}\\u{1F595}-\\u{1F596}\\u{1F5A4}-\\u{1F5A5}\\u{1F5A8}\\u{1F5B1}-\\u{1F5B2}\\u{1F5BC}\\u{1F5C2}-\\u{1F5C4}\\u{1F5D1}-\\u{1F5D3}\\u{1F5DC}-\\u{1F5DE}\\u{1F5E1}\\u{1F5E3}\\u{1F5E8}\\u{1F5EF}\\u{1F5F3}\\u{1F5FA}-\\u{1F64F}\\u{1F680}-\\u{1F6C5}\\u{1F6CB}-\\u{1F6D2}\\u{1F6D5}-\\u{1F6E5}\\u{1F6E9}\\u{1F6EB}-\\u{1F6F0}\\u{1F6F3}-\\u{1F6FF}\\u{1F7DA}-\\u{1F7FF}\\u{1F80C}-\\u{1F80F}\\u{1F848}-\\u{1F84F}\\u{1F85A}-\\u{1F85F}\\u{1F888}-\\u{1F88F}\\u{1F8AE}-\\u{1F8AF}\\u{1F8BC}-\\u{1F8BF}\\u{1F8C2}-\\u{1F8CF}\\u{1F8D9}-\\u{1F8FF}\\u{1F90C}-\\u{1F93A}\\u{1F93C}-\\u{1F945}\\u{1F947}-\\u{1F9FF}\\u{1FA58}-\\u{1FA5F}\\u{1FA6E}-\\u{1FAFF}\\u{1FC00}-\\u{1FFFD}]|[\\u0023\\u002A\\u0030-\\u0039\\u200D\\u20E3\\uFE0F\\u{1F1E6}-\\u{1F1FF}\\u{1F3FB}-\\u{1F3FF}\\u{1F9B0}-\\u{1F9B3}\\u{E0020}-\\u{E007F}])+$"), "u");
}
const prefix = "^\\p{ASCII}";
export const concatenated = new RegExp((prefix, "^[\\u0000-\\u007F]+$"), "u");
export const twice = new RegExp((later, "[\\u0000-\\u007F][\\u0000-\\u007F]"), "u");
const inner = "\\p{ASCII_Hex_Digit}";
const outer = `^${inner}+$`;
export const composed = new RegExp((outer, "^[\\u0030-\\u0039\\u0041-\\u0046\\u0061-\\u0066]+$"), "u");
export function nestedHoisting() {
    {
        function check() {
            return new RegExp((local, "^[\\u0030-\\u0039\\u0041-\\u0046\\u0061-\\u0066]+$"), "u");
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
export const flagsConstant = RegExp("[\\u0000-\\u007F]", flags);
export function dynamic(source) {
    return new RegExp(source, "u");
}
let mutable = "\\p{ASCII}";
export const notConstant = new RegExp(mutable, "u");
export function localRegExp() {
    function RegExp1(source) {
        return source;
    }
    return RegExp1("\\p{ASCII}", "u") + RegExp1(later, "u");
}
