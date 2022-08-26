(function(o, { d: a  }) {
    console.log((o = "foo"), arguments[0]);
})("baz", {
    d: "Bar"
});
