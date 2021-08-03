const obj = {
    navigate: function(fragment, options) {
        if (!History.started) return !1;
        options && !0 !== options || (options = {
            trigger: !!options
        });
    }
};
