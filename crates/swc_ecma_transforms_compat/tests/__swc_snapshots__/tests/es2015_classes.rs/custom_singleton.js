let singleton;
let Sub = /*#__PURE__*/ function(Foo) {
    "use strict";
    _inherits(Sub, Foo);
    var _super = _create_super(Sub);
    function Sub() {
        _class_call_check(this, Sub);
        var _this;
        if (singleton) {
            return _possible_constructor_return(_this, singleton);
        }
        singleton = _this = _super.call(this);
        return _possible_constructor_return(_this);
    }
    return Sub;
}(Foo);
