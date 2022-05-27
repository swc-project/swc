(function({ d: b  }) {
    console.log((a = "foo"), arguments[0].d);
})({
    d: "Bar"
});
