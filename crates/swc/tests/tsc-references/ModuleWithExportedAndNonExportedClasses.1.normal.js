//// [ModuleWithExportedAndNonExportedClasses.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var A;
(function(A) {
    var _$A = function A() {
        "use strict";
        _class_call_check(this, A);
    };
    A.A = _$A;
    var AG = function AG() {
        "use strict";
        _class_call_check(this, AG);
    };
    A.AG = AG;
    var A2 = function A2() {
        "use strict";
        _class_call_check(this, A2);
    };
    var AG2 = function AG2() {
        "use strict";
        _class_call_check(this, AG2);
    };
})(A || (A = {}));
// no errors expected, these are all exported
var a;
var a = new A.A();
var AG = new A.AG();
// errors expected, these are not exported
var a2 = new A.A2();
var ag2 = new A.A2();
