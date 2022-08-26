jQuery.fn.load = function(e, t, i) {
    if (typeof e !== "string" && _load) {
        return _load.apply(this, arguments);
    }
    var n, f, a, l = this, o = e.indexOf(" ");
    if (o >= 0) {
        n = e.slice(o, e.length);
        e = e.slice(0, o);
    }
    if (jQuery.isFunction(t)) {
        i = t;
        t = undefined;
    } else if (t && typeof t === "object") {
        a = "POST";
    }
    if (l.length > 0) {
        jQuery.ajax({
            url: e,
            type: a,
            dataType: "html",
            data: t
        }).done(function(e) {
            f = arguments;
            l.html(n ? jQuery("<div>").append(jQuery.parseHTML(e)).find(n) : e);
        }).complete(i && function(e, t) {
            l.each(i, f || [
                e.responseText,
                t,
                e
            ]);
        });
    }
    return this;
};
