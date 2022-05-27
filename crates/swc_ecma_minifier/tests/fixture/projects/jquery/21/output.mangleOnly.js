jQuery.fn.load = function(a, b, d) {
    if (typeof a !== "string" && _load) {
        return _load.apply(this, arguments);
    }
    var f, h, e, g = this, c = a.indexOf(" ");
    if (c >= 0) {
        f = a.slice(c, a.length);
        a = a.slice(0, c);
    }
    if (jQuery.isFunction(b)) {
        d = b;
        b = undefined;
    } else if (b && typeof b === "object") {
        e = "POST";
    }
    if (g.length > 0) {
        jQuery.ajax({
            url: a,
            type: e,
            dataType: "html",
            data: b
        }).done(function(a) {
            h = arguments;
            g.html(f ? jQuery("<div>").append(jQuery.parseHTML(a)).find(f) : a);
        }).complete(d && function(a, b) {
            g.each(d, h || [
                a.responseText,
                b,
                a
            ]);
        });
    }
    return this;
};
