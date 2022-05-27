(function(a, { d: b  }) {
    console.log((a = "foo"), arguments[0]);
})("baz", {
    d: "Bar"
});
