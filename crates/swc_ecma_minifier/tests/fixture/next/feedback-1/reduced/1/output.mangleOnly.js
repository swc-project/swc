export function getInsertStringLength(a, b, c, d) {
    var e = a.mask, f = a.maskChar, g = c.split(""), h = d;
    return (g.every(function(b) {
        for(; (g = b), isPermanentCharacter(a, (c = d)) && g !== e[c];)if (++d >= e.length) return !1;
        var c, g;
        return ((isAllowedCharacter(a, d, b) || b === f) && d++, d < e.length);
    }), d - h);
}
