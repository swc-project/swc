(function({ d: b  }, a) {
    console.log((a = "foo"), arguments[0].d);
})({
    d: "Bar"
}, "baz");
