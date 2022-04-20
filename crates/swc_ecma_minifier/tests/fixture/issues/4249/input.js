foo({
    bar: function bar(data, baz) {
        if (
            !(baz ? data.quxA : data.quxB) &&
            !(baz ? data.corgeA : data.corgeB) &&
            (baz ? data.get("waldo") : data.waldo)
        ) {
            pass();
        } else if (
            !(baz ? data.quxA : data.quxB) &&
            !(baz ? data.get("waldo") : data.waldo) &&
            (baz ? data.corgeA : data.corgeB)
        ) {
            pass();
        }
    }
});