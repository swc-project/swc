foo({
    bar: function c(a, b) {
        if (!(b ? a.quxA : a.quxB) && !(b ? a.corgeA : a.corgeB) && (b ? a.get("waldo") : a.waldo)) {
            pass();
        } else if (!(b ? a.quxA : a.quxB) && !(b ? a.get("waldo") : a.waldo) && (b ? a.corgeA : a.corgeB)) {
            pass();
        }
    }
});
