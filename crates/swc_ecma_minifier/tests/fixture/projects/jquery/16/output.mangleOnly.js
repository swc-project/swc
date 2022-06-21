export const obj = {
    setOffset: function(a, b, c) {
        var d = jQuery.css(a, "position");
        if (d === "static") {
            a.style.position = "relative";
        }
        var e = jQuery(a), f = e.offset(), g = jQuery.css(a, "top"), h = jQuery.css(a, "left"), i = (d === "absolute" || d === "fixed") && jQuery.inArray("auto", [
            g,
            h
        ]) > -1, j = {}, k = {}, l, m;
        if (i) {
            k = e.position();
            l = k.top;
            m = k.left;
        } else {
            l = parseFloat(g) || 0;
            m = parseFloat(h) || 0;
        }
        if (jQuery.isFunction(b)) {
            b = b.call(a, c, f);
        }
        if (b.top != null) {
            j.top = b.top - f.top + l;
        }
        if (b.left != null) {
            j.left = b.left - f.left + m;
        }
        if ("using" in b) {
            b.using.call(a, j);
        } else {
            e.css(j);
        }
    }
};
