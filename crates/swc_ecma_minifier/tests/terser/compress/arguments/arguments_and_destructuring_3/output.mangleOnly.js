(function({ d: o  }, d) {
    console.log((d = "foo"), arguments[0].d);
})({
    d: "Bar"
}, "baz");
