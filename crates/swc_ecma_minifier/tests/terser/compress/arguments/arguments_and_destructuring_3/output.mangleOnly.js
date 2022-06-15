(function({ d: a  }, b) {
    console.log((b = "foo"), arguments[0].d);
})({
    d: "Bar"
}, "baz");
