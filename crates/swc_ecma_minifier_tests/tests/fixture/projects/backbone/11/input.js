const obj = {
    navigate: function (fragment, options) {
        if (!History.started) return false;
        if (!options || options === true) options = { trigger: !!options };
    },
};
