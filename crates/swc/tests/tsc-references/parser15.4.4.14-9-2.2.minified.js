//// [parser15.4.4.14-9-2.ts]
/// Copyright (c) 2012 Ecma International.  All rights reserved. 
/// Ecma International makes this code available under the terms and conditions set
/// forth on http://hg.ecmascript.org/tests/test262/raw-file/tip/LICENSE (the 
/// "Use Terms").   Any redistribution of this code must retain the above 
/// copyright and this notice and otherwise comply with the Use Terms.
/**
 * @path ch15/15.4/15.4.4/15.4.4.14/15.4.4.14-9-2.js
 * @description Array.prototype.indexOf must return correct index (Number)
 */ runTestCase(function() {
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
    if (14 === a.indexOf(-4 / 3) && // a[14]=_float===-(4/3)
    7 === a.indexOf(0) && // a[7] = +0, 0===+0
    7 === a.indexOf(-0) && // a[7] = +0, -0===+0
    10 === a.indexOf(1)) return !0;
});
