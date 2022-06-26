export const exported = {
    toQueryString: function(a, b) {
        var c = [];
        Object.each(a, function(a, d) {
            if (b) d = b + "[" + d + "]";
            var e;
            switch(typeOf(a)){
                case "object":
                    e = Object.toQueryString(a, d);
                    break;
                case "array":
                    var f = {};
                    a.each(function(a, b) {
                        f[b] = a;
                    });
                    e = Object.toQueryString(f, d);
                    break;
                default:
                    e = d + "=" + encodeURIComponent(a);
            }
            if (a != null) c.push(e);
        });
        return c.join("&");
    }
};
