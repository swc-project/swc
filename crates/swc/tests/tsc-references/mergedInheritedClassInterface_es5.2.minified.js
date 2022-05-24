import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
var child, grandchild, BaseClass = function() {
    "use strict";
    function BaseClass() {
        _class_call_check(this, BaseClass);
    }
    return BaseClass.prototype.baseMethod = function() {}, BaseClass;
}(), Child = function(BaseClass) {
    "use strict";
    _inherits(Child, BaseClass);
    var _super = _create_super(Child);
    function Child() {
        return _class_call_check(this, Child), _super.apply(this, arguments);
    }
    return Child.prototype.method = function() {}, Child;
}(BaseClass), ChildNoBaseClass = function() {
    "use strict";
    function ChildNoBaseClass() {
        _class_call_check(this, ChildNoBaseClass);
    }
    return ChildNoBaseClass.prototype.method2 = function() {}, ChildNoBaseClass;
}(), Grandchild = function(ChildNoBaseClass) {
    "use strict";
    _inherits(Grandchild, ChildNoBaseClass);
    var _super = _create_super(Grandchild);
    function Grandchild() {
        return _class_call_check(this, Grandchild), _super.apply(this, arguments);
    }
    return Grandchild;
}(ChildNoBaseClass);
child.required, child.optional, child.additional, child.baseNumber, child.classNumber, child.baseMethod(), child.method(), grandchild.required, grandchild.optional, grandchild.additional2, grandchild.classString, grandchild.method2();
