import * as swcHelpers from "@swc/helpers";
var child, grandchild, BaseClass = function() {
    "use strict";
    function BaseClass() {
        swcHelpers.classCallCheck(this, BaseClass);
    }
    return swcHelpers.createClass(BaseClass, [
        {
            key: "baseMethod",
            value: function() {}
        }
    ]), BaseClass;
}(), Child = function(BaseClass) {
    "use strict";
    swcHelpers.inherits(Child, BaseClass);
    var _super = swcHelpers.createSuper(Child);
    function Child() {
        return swcHelpers.classCallCheck(this, Child), _super.apply(this, arguments);
    }
    return swcHelpers.createClass(Child, [
        {
            key: "method",
            value: function() {}
        }
    ]), Child;
}(BaseClass), ChildNoBaseClass = function() {
    "use strict";
    function ChildNoBaseClass() {
        swcHelpers.classCallCheck(this, ChildNoBaseClass);
    }
    return swcHelpers.createClass(ChildNoBaseClass, [
        {
            key: "method2",
            value: function() {}
        }
    ]), ChildNoBaseClass;
}(), Grandchild = function(ChildNoBaseClass) {
    "use strict";
    swcHelpers.inherits(Grandchild, ChildNoBaseClass);
    var _super = swcHelpers.createSuper(Grandchild);
    function Grandchild() {
        return swcHelpers.classCallCheck(this, Grandchild), _super.apply(this, arguments);
    }
    return Grandchild;
}(ChildNoBaseClass);
child.required, child.optional, child.additional, child.baseNumber, child.classNumber, child.baseMethod(), child.method(), grandchild.required, grandchild.optional, grandchild.additional2, grandchild.classString, grandchild.method2();
