export const obj = {
    style: function(a, b, c, d) {
        if (!a || a.nodeType === 3 || a.nodeType === 8 || !a.style) {
            return;
        }
        var e, f, g, h = jQuery.camelCase(b), i = a.style;
        b = jQuery.cssProps[h] || (jQuery.cssProps[h] = vendorPropName(i, h));
        g = jQuery.cssHooks[b] || jQuery.cssHooks[h];
        if (c !== undefined) {
            f = typeof c;
            if (f === "string" && (e = rrelNum.exec(c))) {
                c = (e[1] + 1) * e[2] + parseFloat(jQuery.css(a, b));
                f = "number";
            }
            if (c == null || (f === "number" && isNaN(c))) {
                return;
            }
            if (f === "number" && !jQuery.cssNumber[h]) {
                c += "px";
            }
            if (!jQuery.support.clearCloneStyle && c === "" && b.indexOf("background") === 0) {
                i[b] = "inherit";
            }
            if (!g || !("set" in g) || (c = g.set(a, c, d)) !== undefined) {
                try {
                    i[b] = c;
                } catch (j) {}
            }
        } else {
            if (g && "get" in g && (e = g.get(a, false, d)) !== undefined) {
                return e;
            }
            return i[b];
        }
    }
};
