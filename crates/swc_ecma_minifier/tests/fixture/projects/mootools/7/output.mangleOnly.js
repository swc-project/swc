export const exported = {
    toQueryString: function(a, c) {
        var b = [];
        Object.each(a, function(a, d) {
            if (c) d = c + "[" + d + "]";
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
            if (a != null) b.push(e);
        });
        return b.join("&");
    }
};
