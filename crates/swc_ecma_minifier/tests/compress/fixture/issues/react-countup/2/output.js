export function formatNumber(t1) {
    i = Math.abs(t1).toFixed(s.options.decimalPlaces);
    var i, a, n, e, o = (i += "").split(".");
    if (a = o[0], n = o.length > 1 ? s.options.decimal + o[1] : "", s.options.useGrouping) {
        e = "";
        for(var l = 0, h = a.length; l < h; ++l)0 !== l && l % 3 == 0 && (e = s.options.separator + e), e = a[h - l - 1] + e;
        a = e;
    }
    return s.options.numerals && s.options.numerals.length && (a = a.replace(/[0-9]/g, function(t) {
        return s.options.numerals[+t];
    }), n = n.replace(/[0-9]/g, function(t) {
        return s.options.numerals[+t];
    })), (t1 < 0 ? "-" : "") + s.options.prefix + a + n + s.options.suffix;
}
