jQuery.fn.load = function(a, b, c) {
    if (typeof a !== "string" && _load) {
        return _load.apply(this, arguments);
    }
    var d, e, f, g = this, h = a.indexOf(" ");
    if (h >= 0) {
        d = a.slice(h, a.length);
        a = a.slice(0, h);
    }
    if (jQuery.isFunction(b)) {
        c = b;
        b = undefined;
    } else if (b && typeof b === "object") {
        f = "POST";
    }
    if (g.length > 0) {
        jQuery.ajax({
            url: a,
            type: f,
            dataType: "html",
            data: b
        }).done(function(a) {
            e = arguments;
            g.html(d ? jQuery("<div>").append(jQuery.parseHTML(a)).find(d) : a);
        }).complete(c && function(a, b) {
            g.each(c, e || [
                a.responseText,
                b,
                a
            ]);
        });
    }
    return this;
};
