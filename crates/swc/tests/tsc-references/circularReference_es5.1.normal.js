import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @Filename: foo1.ts
var foo2 = require("./foo2");
export var M1;
(function(M11) {
    var C1 = function C1() {
        "use strict";
        _class_call_check(this, C1);
        this.m1 = new foo2.M1.C1();
        this.m1.y = 10; // OK
        this.m1.x = 20; // Error
    };
    M11.C1 = C1;
})(M1 || (M1 = {}));
// @Filename: foo2.ts
var foo1 = require("./foo1");
(function(M12) {
    var C1 = function C1() {
        "use strict";
        _class_call_check(this, C1);
        this.m1 = new foo1.M1.C1();
        this.m1.y = 10; // Error
        this.m1.x = 20; // OK
        var tmp = new M1.C1();
        tmp.y = 10; // OK
        tmp.x = 20; // Error			
    };
    M12.C1 = C1;
})(M1 || (M1 = {}));
