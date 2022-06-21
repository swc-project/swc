foo({
    bar: function a(b, c) {
        if (!(c ? b.quxA : b.quxB) && !(c ? b.corgeA : b.corgeB) && (c ? b.get("waldo") : b.waldo)) {
            pass();
        } else if (!(c ? b.quxA : b.quxB) && !(c ? b.get("waldo") : b.waldo) && (c ? b.corgeA : b.corgeB)) {
            pass();
        }
    }
});
