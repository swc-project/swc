export function formatNumber(o) {
    var n, t, e, r, i = o < 0 ? "-" : "";
    n = Math.abs(o).toFixed(s.options.decimalPlaces);
    var p = (n += "").split(".");
    if (((t = p[0]), (e = p.length > 1 ? s.options.decimal + p[1] : ""), s.options.useGrouping)) {
        r = "";
        for(var a = 0, u = t.length; a < u; ++a)0 !== a && a % 3 == 0 && (r = s.options.separator + r), (r = t[u - a - 1] + r);
        t = r;
    }
    return (s.options.numerals && s.options.numerals.length && ((t = t.replace(/[0-9]/g, function(o) {
        return s.options.numerals[+o];
    })), (e = e.replace(/[0-9]/g, function(o) {
        return s.options.numerals[+o];
    }))), i + s.options.prefix + t + e + s.options.suffix);
}
