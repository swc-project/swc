var TestEmpty = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(TestEmpty, _superClass);
    var _super = _create_super(TestEmpty);
    function TestEmpty() {
        _class_call_check(this, TestEmpty);
        return _super.apply(this, arguments);
    }
    return TestEmpty;
}(function _class() {
    "use strict";
    _class_call_check(this, _class);
});
var TestConstructorOnly = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(TestConstructorOnly, _superClass);
    var _super = _create_super(TestConstructorOnly);
    function TestConstructorOnly() {
        _class_call_check(this, TestConstructorOnly);
        return _super.apply(this, arguments);
    }
    return TestConstructorOnly;
}(function _class() {
    "use strict";
    _class_call_check(this, _class);
});
var TestMethodOnly = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(TestMethodOnly, _superClass);
    var _super = _create_super(TestMethodOnly);
    function TestMethodOnly() {
        _class_call_check(this, TestMethodOnly);
        return _super.apply(this, arguments);
    }
    return TestMethodOnly;
}(/*#__PURE__*/ function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    _create_class(_class, [
        {
            key: "method",
            value: function method() {}
        }
    ]);
    return _class;
}());
var TestConstructorAndMethod = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(TestConstructorAndMethod, _superClass);
    var _super = _create_super(TestConstructorAndMethod);
    function TestConstructorAndMethod() {
        _class_call_check(this, TestConstructorAndMethod);
        return _super.apply(this, arguments);
    }
    return TestConstructorAndMethod;
}(/*#__PURE__*/ function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    _create_class(_class, [
        {
            key: "method",
            value: function method() {}
        }
    ]);
    return _class;
}());
var TestMultipleMethods = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(TestMultipleMethods, _superClass);
    var _super = _create_super(TestMultipleMethods);
    function TestMultipleMethods() {
        _class_call_check(this, TestMultipleMethods);
        return _super.apply(this, arguments);
    }
    return TestMultipleMethods;
}(/*#__PURE__*/ function() {
    "use strict";
    function _class() {
        _class_call_check(this, _class);
    }
    _create_class(_class, [
        {
            key: "m1",
            value: function m1() {}
        },
        {
            key: "m2",
            value: function m2() {}
        }
    ]);
    return _class;
}());
