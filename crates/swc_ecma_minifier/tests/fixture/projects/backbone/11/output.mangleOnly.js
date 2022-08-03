const t = {
    navigate: function(t, e) {
        if (!History.started) return false;
        if (!e || e === true) e = {
            trigger: !!e
        };
    }
};
