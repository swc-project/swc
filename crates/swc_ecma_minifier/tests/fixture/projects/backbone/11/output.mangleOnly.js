const a = {
    navigate: function(a, b) {
        if (!History.started) return false;
        if (!b || b === true) b = {
            trigger: !!b
        };
    }
};
