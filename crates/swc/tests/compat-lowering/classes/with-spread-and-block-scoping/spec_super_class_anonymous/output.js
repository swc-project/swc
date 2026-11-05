var TestEmpty = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(TestEmpty, _superClass);
    function TestEmpty() {
        _class_call_check(this, TestEmpty);
        return _call_super(this, TestEmpty, arguments);
    }
    return TestEmpty;
}(function _class() {
    "use strict";
    _class_call_check(this, _class);
});
var TestConstructorOnly = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(TestConstructorOnly, _superClass);
    function TestConstructorOnly() {
        _class_call_check(this, TestConstructorOnly);
        return _call_super(this, TestConstructorOnly, arguments);
    }
    return TestConstructorOnly;
}(function _class() {
    "use strict";
    _class_call_check(this, _class);
});
var TestMethodOnly = /*#__PURE__*/ function(_superClass) {
    "use strict";
    _inherits(TestMethodOnly, _superClass);
    function TestMethodOnly() {
        _class_call_check(this, TestMethodOnly);
        return _call_super(this, TestMethodOnly, arguments);
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
    function TestConstructorAndMethod() {
        _class_call_check(this, TestConstructorAndMethod);
        return _call_super(this, TestConstructorAndMethod, arguments);
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
    function TestMultipleMethods() {
        _class_call_check(this, TestMultipleMethods);
        return _call_super(this, TestMultipleMethods, arguments);
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
