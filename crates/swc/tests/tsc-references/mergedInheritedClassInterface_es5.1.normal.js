import * as swcHelpers from "@swc/helpers";
var BaseClass = /*#__PURE__*/ function() {
    "use strict";
    function BaseClass() {
        swcHelpers.classCallCheck(this, BaseClass);
    }
    var _proto = BaseClass.prototype;
    _proto.baseMethod = function baseMethod() {};
    return BaseClass;
}();
var Child = /*#__PURE__*/ function(BaseClass) {
    "use strict";
    swcHelpers.inherits(Child, BaseClass);
    var _super = swcHelpers.createSuper(Child);
    function Child() {
        swcHelpers.classCallCheck(this, Child);
        return _super.apply(this, arguments);
    }
    var _proto = Child.prototype;
    _proto.method = function method() {};
    return Child;
}(BaseClass);
var ChildNoBaseClass = /*#__PURE__*/ function() {
    "use strict";
    function ChildNoBaseClass() {
        swcHelpers.classCallCheck(this, ChildNoBaseClass);
    }
    var _proto = ChildNoBaseClass.prototype;
    _proto.method2 = function method2() {};
    return ChildNoBaseClass;
}();
var Grandchild = /*#__PURE__*/ function(ChildNoBaseClass) {
    "use strict";
    swcHelpers.inherits(Grandchild, ChildNoBaseClass);
    var _super = swcHelpers.createSuper(Grandchild);
    function Grandchild() {
        swcHelpers.classCallCheck(this, Grandchild);
        return _super.apply(this, arguments);
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
