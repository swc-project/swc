(function({ d: d  }, n) {
    console.log((n = "foo"), arguments[0].d);
})({
    d: "Bar"
}, "baz");
