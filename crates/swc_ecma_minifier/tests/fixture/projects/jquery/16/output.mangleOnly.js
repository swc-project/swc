export const obj = {
    setOffset: function(t, e, s) {
        var i = jQuery.css(t, "position");
        if (i === "static") {
            t.style.position = "relative";
        }
        var o = jQuery(t), l = o.offset(), f = jQuery.css(t, "top"), n = jQuery.css(t, "left"), r = (i === "absolute" || i === "fixed") && jQuery.inArray("auto", [
            f,
            n
        ]) > -1, u = {}, a = {}, p, c;
        if (r) {
            a = o.position();
            p = a.top;
            c = a.left;
        } else {
            p = parseFloat(f) || 0;
            c = parseFloat(n) || 0;
        }
        if (jQuery.isFunction(e)) {
            e = e.call(t, s, l);
        }
        if (e.top != null) {
            u.top = e.top - l.top + p;
        }
        if (e.left != null) {
            u.left = e.left - l.left + c;
        }
        if ("using" in e) {
            e.using.call(t, u);
        } else {
            o.css(u);
        }
    }
};
