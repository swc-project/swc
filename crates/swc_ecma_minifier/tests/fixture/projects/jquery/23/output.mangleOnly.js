export const obj = {
    style: function(e, s, r, t) {
        if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style) {
            return;
        }
        var n, o, i, c = jQuery.camelCase(s), f = e.style;
        s = jQuery.cssProps[c] || (jQuery.cssProps[c] = vendorPropName(f, c));
        i = jQuery.cssHooks[s] || jQuery.cssHooks[c];
        if (r !== undefined) {
            o = typeof r;
            if (o === "string" && (n = rrelNum.exec(r))) {
                r = (n[1] + 1) * n[2] + parseFloat(jQuery.css(e, s));
                o = "number";
            }
            if (r == null || (o === "number" && isNaN(r))) {
                return;
            }
            if (o === "number" && !jQuery.cssNumber[c]) {
                r += "px";
            }
            if (!jQuery.support.clearCloneStyle && r === "" && s.indexOf("background") === 0) {
                f[s] = "inherit";
            }
            if (!i || !("set" in i) || (r = i.set(e, r, t)) !== undefined) {
                try {
                    f[s] = r;
                } catch (u) {}
            }
        } else {
            if (i && "get" in i && (n = i.get(e, false, t)) !== undefined) {
                return n;
            }
            return f[s];
        }
    }
};
