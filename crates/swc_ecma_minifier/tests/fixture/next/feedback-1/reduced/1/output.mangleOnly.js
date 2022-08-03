export function getInsertStringLength(r, t, n, e) {
    var a = r.mask, g = r.maskChar, i = n.split(""), u = e;
    return (i.every(function(t) {
        for(; (i = t), isPermanentCharacter(r, (n = e)) && i !== a[n];)if (++e >= a.length) return !1;
        var n, i;
        return ((isAllowedCharacter(r, e, t) || t === g) && e++, e < a.length);
    }), e - u);
}
