(function ({ d: d }, a) {
    console.log((a = "foo"), arguments[0].d);
})({ d: "Bar" }, "baz");
