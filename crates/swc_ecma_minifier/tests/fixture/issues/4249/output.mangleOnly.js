foo({
    bar: function e(o, g) {
        if (!(g ? o.quxA : o.quxB) && !(g ? o.corgeA : o.corgeB) && (g ? o.get("waldo") : o.waldo)) {
            pass();
        } else if (!(g ? o.quxA : o.quxB) && !(g ? o.get("waldo") : o.waldo) && (g ? o.corgeA : o.corgeB)) {
            pass();
        }
    }
});
