//// [foo1.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(M1) {
    var C1 = function C1() {
        "use strict";
        _class_call_check(this, C1);
        this.m1 = new foo2.M1.C1();
        this.m1.y = 10; // OK
        this.m1.x = 20; // Error
    };
    M1.C1 = C1;
})(M1 || (M1 = {}));
export var M1;
//// [foo2.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
(function(M1) {
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
    M1.C1 = C1;
})(M1 || (M1 = {}));
export var M1;
