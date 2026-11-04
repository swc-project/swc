let singleton;
let Sub = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Sub, Foo);
    function Sub() {
        _class_call_check(this, Sub);
        var _this;
        if (singleton) {
            return _possible_constructor_return(_this, singleton);
        }
        singleton = _this = _call_super(this, Sub);
        return _this;
    }
    return Sub;
}(Foo);
