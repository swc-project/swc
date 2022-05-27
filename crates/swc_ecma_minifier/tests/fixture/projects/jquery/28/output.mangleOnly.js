export const E = {
    queue: function(d, b, c) {
        var a;
        if (d) {
            b = (b || "fx") + "queue";
            a = jQuery._data(d, b);
            if (c) {
                if (!a || jQuery.isArray(c)) {
                    a = jQuery._data(d, b, jQuery.makeArray(c));
                } else {
                    a.push(c);
                }
            }
            return a || [];
        }
    }
};
