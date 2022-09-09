(function ({ d: o }) {
    console.log((a = "foo"), arguments[0].d);
})({ d: "Bar" });
