var _assert_this_initialized = require("@swc/helpers/_/_assert_this_initialized");
var _call_super = require("@swc/helpers/_/_call_super");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _inherits = require("@swc/helpers/_/_inherits");
var Bar = function Bar() {
    "use strict";
    _class_call_check._(this, Bar);
};
var Foo = /*#__PURE__*/ function(Bar) {
    "use strict";
    _inherits._(Foo, Bar);
    function Foo() {
        _class_call_check._(this, Foo);
        var _this;
        switch(0){
            case 0:
                break;
            default:
                _this = _call_super._(this, Foo);
        }
        return _assert_this_initialized._(_this);
    }
    return Foo;
}(Bar);
try {
    new Foo();
} catch (e) {
    console.log("catched");
}
