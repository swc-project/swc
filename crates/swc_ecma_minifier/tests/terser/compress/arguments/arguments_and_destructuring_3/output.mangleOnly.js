(function({ d: d }, o) {
    console.log((o = "foo"), arguments[0].d);
})({
    d: "Bar"
}, "baz");
