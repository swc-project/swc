const t = {
    navigate: function(t, r) {
        if (!History.started) return false;
        if (!r || r === true) r = {
            trigger: !!r
        };
    }
};
