export const obj = {
    style: function(e, s, t, r) {
        if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style) {
            return;
        }
        var o, n, c, f = jQuery.camelCase(s), i = e.style;
        s = jQuery.cssProps[f] || (jQuery.cssProps[f] = vendorPropName(i, f));
        c = jQuery.cssHooks[s] || jQuery.cssHooks[f];
        if (t !== undefined) {
            n = typeof t;
            if (n === "string" && (o = rrelNum.exec(t))) {
                t = (o[1] + 1) * o[2] + parseFloat(jQuery.css(e, s));
                n = "number";
            }
            if (t == null || (n === "number" && isNaN(t))) {
                return;
            }
            if (n === "number" && !jQuery.cssNumber[f]) {
                t += "px";
            }
            if (!jQuery.support.clearCloneStyle && t === "" && s.indexOf("background") === 0) {
                i[s] = "inherit";
            }
            if (!c || !("set" in c) || (t = c.set(e, t, r)) !== undefined) {
                try {
                    i[s] = t;
                } catch (l) {}
            }
        } else {
            if (c && "get" in c && (o = c.get(e, false, r)) !== undefined) {
                return o;
            }
            return i[s];
        }
    }
};
