var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _sliced_to_array = require("@swc/helpers/_/_sliced_to_array");
new A();
new A();
0, new A();
var _obj_x = obj.x, x = _obj_x === void 0 ? function() {
    new A();
} : _obj_x, _obj_y = obj.y, _obj_y_z = _obj_y.z, z = _obj_y_z === void 0 ? function() {
    new A();
} : _obj_y_z;
var _ref = [], tmp = _ref[0], a = tmp === void 0 ? function() {
    new A();
} : tmp, _ref_ = _sliced_to_array._(_ref[1], 1), tmp1 = _ref_[0], b = tmp1 === void 0 ? function() {
    new A();
} : tmp1;
new A(), 0;
var x = new A(function() {
    new B();
});
// should check only outer new expr
new A(new A());
new A(new A(function() {
    new B();
}));
var x = (new A(), 0);
var x = (0, new A(function() {
    new B();
}));
var x = {
    x: new A(function() {
        new B();
    })
};
function foo() {
    var arg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
        new A();
    };
}
// Valid cases
var x = new A();
x = new A();
var _obj_x1 = obj.x, x = _obj_x1 === void 0 ? new A() : _obj_x1;
var x = (0, new A());
var x = {
    a: new A()
};
f(new A());
f({
    x: new A()
});
var X = function X() {
    "use strict";
    _class_call_check._(this, X);
    this.x = new A();
};
