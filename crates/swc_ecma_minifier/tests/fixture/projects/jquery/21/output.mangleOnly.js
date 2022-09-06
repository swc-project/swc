jQuery.fn.load = function(e, t, n) {
    if (typeof e !== "string" && _load) {
        return _load.apply(this, arguments);
    }
    var i, a, f, r = this, l = e.indexOf(" ");
    if (l >= 0) {
        i = e.slice(l, e.length);
        e = e.slice(0, l);
    }
    if (jQuery.isFunction(t)) {
        n = t;
        t = undefined;
    } else if (t && typeof t === "object") {
        f = "POST";
    }
    if (r.length > 0) {
        jQuery.ajax({
            url: e,
            type: f,
            dataType: "html",
            data: t
        }).done(function(e) {
            a = arguments;
            r.html(i ? jQuery("<div>").append(jQuery.parseHTML(e)).find(i) : e);
        }).complete(n && function(e, t) {
            r.each(n, a || [
                e.responseText,
                t,
                e
            ]);
        });
    }
    return this;
};
