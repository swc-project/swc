const a = {
    navigate: function(b, a) {
        if (!History.started) return false;
        if (!a || a === true) a = {
            trigger: !!a
        };
    }
};
