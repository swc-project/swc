export function getInsertStringLength(r, e, t, n) {
    var a = r.mask, i = r.maskChar, h = t.split(""), s = n;
    return (h.every(function(e) {
        for(; (h = e), isPermanentCharacter(r, (t = n)) && h !== a[t];)if (++n >= a.length) return !1;
        var t, h;
        return ((isAllowedCharacter(r, n, e) || e === i) && n++, n < a.length);
    }), n - s);
}
