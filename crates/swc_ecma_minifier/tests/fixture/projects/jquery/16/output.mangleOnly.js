export const obj = {
    setOffset: function(b, a, l) {
        var d = jQuery.css(b, "position");
        if (d === "static") {
            b.style.position = "relative";
        }
        var e = jQuery(b), f = e.offset(), j = jQuery.css(b, "top"), k = jQuery.css(b, "left"), m = (d === "absolute" || d === "fixed") && jQuery.inArray("auto", [
            j,
            k
        ]) > -1, c = {}, g = {}, h, i;
        if (m) {
            g = e.position();
            h = g.top;
            i = g.left;
        } else {
            h = parseFloat(j) || 0;
            i = parseFloat(k) || 0;
        }
        if (jQuery.isFunction(a)) {
            a = a.call(b, l, f);
        }
        if (a.top != null) {
            c.top = a.top - f.top + h;
        }
        if (a.left != null) {
            c.left = a.left - f.left + i;
        }
        if ("using" in a) {
            a.using.call(b, c);
        } else {
            e.css(c);
        }
    }
};
