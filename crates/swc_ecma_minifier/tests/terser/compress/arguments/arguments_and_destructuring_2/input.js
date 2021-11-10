(function (a, { d: d }) {
    console.log((a = "foo"), arguments[0]);
})("baz", { d: "Bar" });
