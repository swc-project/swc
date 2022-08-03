export const E = {
    queue: function(a, r, e) {
        var t;
        if (a) {
            r = (r || "fx") + "queue";
            t = jQuery._data(a, r);
            if (e) {
                if (!t || jQuery.isArray(e)) {
                    t = jQuery._data(a, r, jQuery.makeArray(e));
                } else {
                    t.push(e);
                }
            }
            return t || [];
        }
    }
};
