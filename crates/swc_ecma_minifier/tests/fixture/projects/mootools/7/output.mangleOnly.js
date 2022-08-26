export const exported = {
    toQueryString: function(r, t) {
        var e = [];
        Object.each(r, function(r, n) {
            if (t) n = t + "[" + n + "]";
            var a;
            switch(typeOf(r)){
                case "object":
                    a = Object.toQueryString(r, n);
                    break;
                case "array":
                    var o = {};
                    r.each(function(r, t) {
                        o[t] = r;
                    });
                    a = Object.toQueryString(o, n);
                    break;
                default:
                    a = n + "=" + encodeURIComponent(r);
            }
            if (r != null) e.push(a);
        });
        return e.join("&");
    }
};
