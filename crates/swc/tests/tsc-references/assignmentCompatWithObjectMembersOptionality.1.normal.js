//// [assignmentCompatWithObjectMembersOptionality.ts]
// Derived member is not optional but base member is, should be ok
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
var Base = function Base() {
    "use strict";
    _class_call_check(this, Base);
};
var Derived = /*#__PURE__*/ function(Base) {
    "use strict";
    _inherits(Derived, Base);
    var _super = _create_super(Derived);
    function Derived() {
        _class_call_check(this, Derived);
        return _super.apply(this, arguments);
    }
    return Derived;
}(Base);
var Derived2 = /*#__PURE__*/ function(Derived) {
    "use strict";
    _inherits(Derived2, Derived);
    var _super = _create_super(Derived2);
    function Derived2() {
        _class_call_check(this, Derived2);
        return _super.apply(this, arguments);
    }
    return Derived2;
}(Derived);
var TargetHasOptional;
(function(TargetHasOptional) {
    var c;
    var a;
    var b = {
        opt: new Base()
    };
    var d;
    var e;
    var f;
    // all ok
    c = d;
    c = e;
    c = f;
    c = a;
    a = d;
    a = e;
    a = f;
    a = c;
    b = d;
    b = e;
    b = f;
    b = a;
    b = c;
})(TargetHasOptional || (TargetHasOptional = {}));
var SourceHasOptional;
(function(SourceHasOptional) {
    var c;
    var a;
    var b = {
        opt: new Base()
    };
    var d;
    var e;
    var f;
    c = d; // error
    c = e; // error
    c = f; // ok
    c = a; // ok
    a = d; // error
    a = e; // error
    a = f; // ok
    a = c; // ok
    b = d; // error
    b = e; // error
    b = f; // ok
    b = a; // ok
    b = c; // ok
})(SourceHasOptional || (SourceHasOptional = {}));
