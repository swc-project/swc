(function(d, { d: n  }) {
    console.log((d = "foo"), arguments[0]);
})("baz", {
    d: "Bar"
});
