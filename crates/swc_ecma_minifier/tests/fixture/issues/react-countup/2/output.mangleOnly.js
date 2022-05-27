export function formatNumber(f) {
    var g, a, d, b, i = f < 0 ? "-" : "";
    g = Math.abs(f).toFixed(s.options.decimalPlaces);
    var e = (g += "").split(".");
    if (((a = e[0]), (d = e.length > 1 ? s.options.decimal + e[1] : ""), s.options.useGrouping)) {
        b = "";
        for(var c = 0, h = a.length; c < h; ++c)0 !== c && c % 3 == 0 && (b = s.options.separator + b), (b = a[h - c - 1] + b);
        a = b;
    }
    return (s.options.numerals && s.options.numerals.length && ((a = a.replace(/[0-9]/g, function(a) {
        return s.options.numerals[+a];
    })), (d = d.replace(/[0-9]/g, function(a) {
        return s.options.numerals[+a];
    }))), i + s.options.prefix + a + d + s.options.suffix);
}
