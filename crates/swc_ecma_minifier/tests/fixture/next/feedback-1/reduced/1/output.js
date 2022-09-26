export function getInsertStringLength(a, e, t, i) {
    var r = a.mask, o = a.maskChar, n = t.split(""), s = i;
    return n.every(function(e) {
        for(var t; isPermanentCharacter(a, t = i) && e !== r[t];)if (++i >= r.length) return !1;
        return (isAllowedCharacter(a, i, e) || e === o) && i++, i < r.length;
    }), i - s;
}
