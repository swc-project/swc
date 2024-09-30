//// [classConstructorAccessibility.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var C = function C(x) {
    "use strict";
    _class_call_check(this, C);
    this.x = x;
};
var D = function D(x) {
    "use strict";
    _class_call_check(this, D);
    this.x = x;
};
var E = function E(x) {
    "use strict";
    _class_call_check(this, E);
    this.x = x;
};
var c = new C(1);
var d = new D(1); // error
var e = new E(1); // error
(function(Generic) {
    var C = function C(x) {
        "use strict";
        _class_call_check(this, C);
        this.x = x;
    };
    var D = function D(x) {
        "use strict";
        _class_call_check(this, D);
        this.x = x;
    };
    var E = function E(x) {
        "use strict";
        _class_call_check(this, E);
        this.x = x;
    };
    var c = new C(1);
    var d = new D(1); // error
    var e = new E(1); // error
})(Generic || (Generic = {}));
var Generic;
