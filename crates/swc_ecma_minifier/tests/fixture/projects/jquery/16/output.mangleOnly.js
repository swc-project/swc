export const obj = {
    setOffset: function(t, s, f) {
        var i = jQuery.css(t, "position");
        if (i === "static") {
            t.style.position = "relative";
        }
        var l = jQuery(t), o = l.offset(), e = jQuery.css(t, "top"), n = jQuery.css(t, "left"), c = (i === "absolute" || i === "fixed") && jQuery.inArray("auto", [
            e,
            n
        ]) > -1, p = {}, a = {}, r, u;
        if (c) {
            a = l.position();
            r = a.top;
            u = a.left;
        } else {
            r = parseFloat(e) || 0;
            u = parseFloat(n) || 0;
        }
        if (jQuery.isFunction(s)) {
            s = s.call(t, f, o);
        }
        if (s.top != null) {
            p.top = s.top - o.top + r;
        }
        if (s.left != null) {
            p.left = s.left - o.left + u;
        }
        if ("using" in s) {
            s.using.call(t, p);
        } else {
            l.css(p);
        }
    }
};
