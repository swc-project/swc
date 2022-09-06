foo({
    bar: function o(e, a) {
        if (!(a ? e.quxA : e.quxB) && !(a ? e.corgeA : e.corgeB) && (a ? e.get("waldo") : e.waldo)) {
            pass();
        } else if (!(a ? e.quxA : e.quxB) && !(a ? e.get("waldo") : e.waldo) && (a ? e.corgeA : e.corgeB)) {
            pass();
        }
    }
});
