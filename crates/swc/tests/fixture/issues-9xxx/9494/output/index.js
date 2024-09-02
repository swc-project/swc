var _call_super = require("@swc/helpers/_/_call_super");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _inherits = require("@swc/helpers/_/_inherits");
var Foo1 = /*#__PURE__*/ function(Bar1) {
    "use strict";
    _inherits._(Foo1, Bar1);
    function Foo1() {
        _class_call_check._(this, Foo1);
        return _call_super._(this, Foo1); // ok
    }
    return Foo1;
}(Bar);
var Foo2 = /*#__PURE__*/ function(Bar1) {
    "use strict";
    _inherits._(Foo2, Bar1);
    function Foo2() {
        _class_call_check._(this, Foo2);
        var _this;
        return 0, _this = _call_super._(this, Foo2); // ?
    }
    return Foo2;
}(Bar);
var Foo3 = /*#__PURE__*/ function(Bar1) {
    "use strict";
    _inherits._(Foo3, Bar1);
    function Foo3() {
        _class_call_check._(this, Foo3);
        var _this;
        [
            _this = _call_super._(this, Foo3)
        ]; // ?
        return _this;
    }
    return Foo3;
}(Bar);
