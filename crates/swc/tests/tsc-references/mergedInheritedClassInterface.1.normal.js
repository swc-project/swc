//// [mergedInheritedClassInterface.ts]
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var BaseClass = /*#__PURE__*/ function() {
    "use strict";
    function BaseClass() {
        _class_call_check(this, BaseClass);
    }
    var _proto = BaseClass.prototype;
    _proto.baseMethod = function baseMethod() {};
    return BaseClass;
}();
var Child = /*#__PURE__*/ function(BaseClass) {
    "use strict";
    _inherits(Child, BaseClass);
    function Child() {
        _class_call_check(this, Child);
        return _call_super(this, Child, arguments);
    }
    var _proto = Child.prototype;
    _proto.method = function method() {};
    return Child;
}(BaseClass);
var ChildNoBaseClass = /*#__PURE__*/ function() {
    "use strict";
    function ChildNoBaseClass() {
        _class_call_check(this, ChildNoBaseClass);
    }
    var _proto = ChildNoBaseClass.prototype;
    _proto.method2 = function method2() {};
    return ChildNoBaseClass;
}();
var Grandchild = /*#__PURE__*/ function(ChildNoBaseClass) {
    "use strict";
    _inherits(Grandchild, ChildNoBaseClass);
    function Grandchild() {
        _class_call_check(this, Grandchild);
        return _call_super(this, Grandchild, arguments);
    }
    return Grandchild;
}(ChildNoBaseClass);
// checks if properties actually were merged
var child;
child.required;
child.optional;
child.additional;
child.baseNumber;
child.classNumber;
child.baseMethod();
child.method();
var grandchild;
grandchild.required;
grandchild.optional;
grandchild.additional2;
grandchild.classString;
grandchild.method2();
