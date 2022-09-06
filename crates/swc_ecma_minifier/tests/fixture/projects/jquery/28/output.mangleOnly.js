export const E = {
    queue: function(e, r, u) {
        var a;
        if (e) {
            r = (r || "fx") + "queue";
            a = jQuery._data(e, r);
            if (u) {
                if (!a || jQuery.isArray(u)) {
                    a = jQuery._data(e, r, jQuery.makeArray(u));
                } else {
                    a.push(u);
                }
            }
            return a || [];
        }
    }
};
