export const exported = {
    toQueryString: function(e, t) {
        var r = [];
        Object.each(e, function(e, n) {
            if (t) n = t + "[" + n + "]";
            var c;
            switch(typeOf(e)){
                case "object":
                    c = Object.toQueryString(e, n);
                    break;
                case "array":
                    var o = {};
                    e.each(function(e, t) {
                        o[t] = e;
                    });
                    c = Object.toQueryString(o, n);
                    break;
                default:
                    c = n + "=" + encodeURIComponent(e);
            }
            if (e != null) r.push(c);
        });
        return r.join("&");
    }
};
