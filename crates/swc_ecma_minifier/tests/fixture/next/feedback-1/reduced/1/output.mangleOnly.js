export function getInsertStringLength(a, f, c, b) {
    var g = a.mask, h = a.maskChar, d = c.split(""), e = b;
    return (d.every(function(c) {
        for(; (e = c), isPermanentCharacter(a, (d = b)) && e !== g[d];)if (++b >= g.length) return !1;
        var d, e;
        return ((isAllowedCharacter(a, b, c) || c === h) && b++, b < g.length);
    }), b - e);
}
