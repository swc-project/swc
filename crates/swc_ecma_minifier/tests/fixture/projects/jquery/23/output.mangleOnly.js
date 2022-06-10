export const obj = {
    style: function(b, c, a, i) {
        if (!b || b.nodeType === 3 || b.nodeType === 8 || !b.style) {
            return;
        }
        var e, f, d, g = jQuery.camelCase(c), h = b.style;
        c = jQuery.cssProps[g] || (jQuery.cssProps[g] = vendorPropName(h, g));
        d = jQuery.cssHooks[c] || jQuery.cssHooks[g];
        if (a !== undefined) {
            f = typeof a;
            if (f === "string" && (e = rrelNum.exec(a))) {
                a = (e[1] + 1) * e[2] + parseFloat(jQuery.css(b, c));
                f = "number";
            }
            if (a == null || (f === "number" && isNaN(a))) {
                return;
            }
            if (f === "number" && !jQuery.cssNumber[g]) {
                a += "px";
            }
            if (!jQuery.support.clearCloneStyle && a === "" && c.indexOf("background") === 0) {
                h[c] = "inherit";
            }
            if (!d || !("set" in d) || (a = d.set(b, a, i)) !== undefined) {
                try {
                    h[c] = a;
                } catch (j) {}
            }
        } else {
            if (d && "get" in d && (e = d.get(b, false, i)) !== undefined) {
                return e;
            }
            return h[c];
        }
    }
};
