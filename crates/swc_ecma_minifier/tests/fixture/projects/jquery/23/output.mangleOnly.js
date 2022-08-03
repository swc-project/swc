export const obj = {
    style: function(e, s, t, r) {
        if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style) {
            return;
        }
        var n, o, c, f = jQuery.camelCase(s), i = e.style;
        s = jQuery.cssProps[f] || (jQuery.cssProps[f] = vendorPropName(i, f));
        c = jQuery.cssHooks[s] || jQuery.cssHooks[f];
        if (t !== undefined) {
            o = typeof t;
            if (o === "string" && (n = rrelNum.exec(t))) {
                t = (n[1] + 1) * n[2] + parseFloat(jQuery.css(e, s));
                o = "number";
            }
            if (t == null || (o === "number" && isNaN(t))) {
                return;
            }
            if (o === "number" && !jQuery.cssNumber[f]) {
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
            if (c && "get" in c && (n = c.get(e, false, r)) !== undefined) {
                return n;
            }
            return i[s];
        }
    }
};
