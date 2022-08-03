export const exported = {
    toQueryString: function(r, t) {
        var n = [];
        Object.each(r, function(r, e) {
            if (t) e = t + "[" + e + "]";
            var a;
            switch(typeOf(r)){
                case "object":
                    a = Object.toQueryString(r, e);
                    break;
                case "array":
                    var i = {};
                    r.each(function(r, t) {
                        i[t] = r;
                    });
                    a = Object.toQueryString(i, e);
                    break;
                default:
                    a = e + "=" + encodeURIComponent(r);
            }
            if (r != null) n.push(a);
        });
        return n.join("&");
    }
};
