export function formatNumber(o) {
    var n, t, e, r, i = o < 0 ? "-" : "";
    n = Math.abs(o).toFixed(s.options.decimalPlaces);
    var a = (n += "").split(".");
    if (((t = a[0]), (e = a.length > 1 ? s.options.decimal + a[1] : ""), s.options.useGrouping)) {
        r = "";
        for(var p = 0, u = t.length; p < u; ++p)0 !== p && p % 3 == 0 && (r = s.options.separator + r), (r = t[u - p - 1] + r);
        t = r;
    }
    return (s.options.numerals && s.options.numerals.length && ((t = t.replace(/[0-9]/g, function(o) {
        return s.options.numerals[+o];
    })), (e = e.replace(/[0-9]/g, function(o) {
        return s.options.numerals[+o];
    }))), i + s.options.prefix + t + e + s.options.suffix);
}
