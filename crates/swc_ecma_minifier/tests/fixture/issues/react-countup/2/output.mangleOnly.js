export function formatNumber(a) {
    var b, c, d, e, f = a < 0 ? "-" : "";
    b = Math.abs(a).toFixed(s.options.decimalPlaces);
    var g = (b += "").split(".");
    if (((c = g[0]), (d = g.length > 1 ? s.options.decimal + g[1] : ""), s.options.useGrouping)) {
        e = "";
        for(var h = 0, i = c.length; h < i; ++h)0 !== h && h % 3 == 0 && (e = s.options.separator + e), (e = c[i - h - 1] + e);
        c = e;
    }
    return (s.options.numerals && s.options.numerals.length && ((c = c.replace(/[0-9]/g, function(a) {
        return s.options.numerals[+a];
    })), (d = d.replace(/[0-9]/g, function(a) {
        return s.options.numerals[+a];
    }))), f + s.options.prefix + c + d + s.options.suffix);
}
