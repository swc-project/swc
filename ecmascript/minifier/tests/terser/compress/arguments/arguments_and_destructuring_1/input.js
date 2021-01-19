(function ({ d: d }) {
    console.log((a = "foo"), arguments[0].d);
})({ d: "Bar" });
