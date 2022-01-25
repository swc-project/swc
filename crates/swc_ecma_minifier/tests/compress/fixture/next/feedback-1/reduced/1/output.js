export function getInsertStringLength(a, e1, t1, i) {
    var r = a.mask, o = a.maskChar, n1 = t1.split(""), s = i;
    return n1.every(function(e) {
        for(var t, n; n = e, isPermanentCharacter(a, t = i) && n !== r[t];)if (++i >= r.length) return !1;
        return (isAllowedCharacter(a, i, e) || e === o) && i++, i < r.length;
    }), i - s;
}
