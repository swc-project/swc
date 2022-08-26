export const obj = {
    setOffset: function(t, s, i) {
        var o = jQuery.css(t, "position");
        if (o === "static") {
            t.style.position = "relative";
        }
        var e = jQuery(t), l = e.offset(), f = jQuery.css(t, "top"), n = jQuery.css(t, "left"), c = (o === "absolute" || o === "fixed") && jQuery.inArray("auto", [
            f,
            n
        ]) > -1, p = {}, a = {}, u, r;
        if (c) {
            a = e.position();
            u = a.top;
            r = a.left;
        } else {
            u = parseFloat(f) || 0;
            r = parseFloat(n) || 0;
        }
        if (jQuery.isFunction(s)) {
            s = s.call(t, i, l);
        }
        if (s.top != null) {
            p.top = s.top - l.top + u;
        }
        if (s.left != null) {
            p.left = s.left - l.left + r;
        }
        if ("using" in s) {
            s.using.call(t, p);
        } else {
            e.css(p);
        }
    }
};
