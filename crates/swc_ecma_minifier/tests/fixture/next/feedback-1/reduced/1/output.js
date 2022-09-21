export function getInsertStringLength(a, e, t, i) {
    var r = a.mask, o = a.maskChar, n = t.split(""), s = i;
    return n.every(function(e) {
        for(var t, n; n = e, isPermanentCharacter(a, t = i) && n !== r[t];)if (++i >= r.length) return !1;
        return (isAllowedCharacter(a, i, e) || e === o) && i++, i < r.length;
    }), i - s;
}
