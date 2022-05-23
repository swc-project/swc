foo({
    bar: function(data, baz) {
        !(!(baz ? data.quxA : data.quxB) && !(baz ? data.corgeA : data.corgeB) && (baz ? data.get("waldo") : data.waldo)) && ((baz ? data.quxA : data.quxB) || (baz ? data.get("waldo") : data.waldo) || (baz ? !data.corgeA : !data.corgeB)) || pass();
    }
});
