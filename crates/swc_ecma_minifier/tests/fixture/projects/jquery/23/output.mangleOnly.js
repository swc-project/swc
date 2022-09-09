export const obj = {
    style: function(e, r, s, n) {
        if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style) {
            return;
        }
        var u, t, i, o = jQuery.camelCase(r), y = e.style;
        r = jQuery.cssProps[o] || (jQuery.cssProps[o] = vendorPropName(y, o));
        i = jQuery.cssHooks[r] || jQuery.cssHooks[o];
        if (s !== undefined) {
            t = typeof s;
            if (t === "string" && (u = rrelNum.exec(s))) {
                s = (u[1] + 1) * u[2] + parseFloat(jQuery.css(e, r));
                t = "number";
            }
            if (s == null || (t === "number" && isNaN(s))) {
                return;
            }
            if (t === "number" && !jQuery.cssNumber[o]) {
                s += "px";
            }
            if (!jQuery.support.clearCloneStyle && s === "" && r.indexOf("background") === 0) {
                y[r] = "inherit";
            }
            if (!i || !("set" in i) || (s = i.set(e, s, n)) !== undefined) {
                try {
                    y[r] = s;
                } catch (f) {}
            }
        } else {
            if (i && "get" in i && (u = i.get(e, false, n)) !== undefined) {
                return u;
            }
            return y[r];
        }
    }
};
