export const E = {
    queue: function(a, b, c) {
        var d;
        if (a) {
            b = (b || "fx") + "queue";
            d = jQuery._data(a, b);
            if (c) {
                if (!d || jQuery.isArray(c)) {
                    d = jQuery._data(a, b, jQuery.makeArray(c));
                } else {
                    d.push(c);
                }
            }
            return d || [];
        }
    }
};
