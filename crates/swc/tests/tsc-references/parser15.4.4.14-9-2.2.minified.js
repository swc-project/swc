//// [parser15.4.4.14-9-2.ts]
runTestCase(function() {
    var a = [
        !1,
        void 0,
        null,
        "0",
        {
            toString: function() {
                return 0;
            }
        },
        -1.3333333333333,
        "str",
        -0,
        !0,
        0,
        1,
        1,
        0,
        !1,
        -4 / 3,
        -4 / 3
    ];
    if (14 === a.indexOf(-4 / 3) && 7 === a.indexOf(0) && 7 === a.indexOf(-0) && 10 === a.indexOf(1)) return !0;
});
