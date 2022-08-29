foo({
    bar: function o(e, g) {
        if (!(g ? e.quxA : e.quxB) && !(g ? e.corgeA : e.corgeB) && (g ? e.get("waldo") : e.waldo)) {
            pass();
        } else if (!(g ? e.quxA : e.quxB) && !(g ? e.get("waldo") : e.waldo) && (g ? e.corgeA : e.corgeB)) {
            pass();
        }
    }
});
