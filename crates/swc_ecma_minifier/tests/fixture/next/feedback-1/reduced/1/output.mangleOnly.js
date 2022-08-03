export function getInsertStringLength(r, n, t, e) {
    var a = r.mask, u = r.maskChar, f = t.split(""), i = e;
    return (f.every(function(n) {
        for(; (f = n), isPermanentCharacter(r, (t = e)) && f !== a[t];)if (++e >= a.length) return !1;
        var t, f;
        return ((isAllowedCharacter(r, e, n) || n === u) && e++, e < a.length);
    }), e - i);
}
