(function (o, { d: n }) {
    console.log((o = "foo"), arguments[0]);
})("baz", { d: "Bar" });
