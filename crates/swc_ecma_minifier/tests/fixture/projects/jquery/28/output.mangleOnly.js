export const E = {
    queue: function(e, a, r) {
        var u;
        if (e) {
            a = (a || "fx") + "queue";
            u = jQuery._data(e, a);
            if (r) {
                if (!u || jQuery.isArray(r)) {
                    u = jQuery._data(e, a, jQuery.makeArray(r));
                } else {
                    u.push(r);
                }
            }
            return u || [];
        }
    }
};
