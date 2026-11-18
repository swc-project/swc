"use strict";
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _define_property = require("@swc/helpers/_/_define_property");
var v = "use strict";
var s = "double quotes string";
// valid cases
var foo = "bar";
var foo = "bar 'baz'";
var foo = 'bar "baz"';
var foo = 1;
var foo = "a string containing `backtick` quotes";
var foo = "bar 'foo' baz" + "bar";
(function() {
    "use strict";
    var foo = "backtick";
});
function f() {
    "use strict";
    var foo = "backtick";
}
(function() {
    "use strict";
    "use strong";
    "use asm";
    var foo = "backtick";
});
// prettier-ignore
var obj = {
    "key0": 0,
    'key1': 1
};
// prettier-ignore
var Foo1 = /*#__PURE__*/ function() {
    function Foo1() {
        _class_call_check._(this, Foo1);
    }
    _create_class._(Foo1, [
        {
            key: 'bar',
            value: function bar() {}
        }
    ]);
    return Foo1;
}();
// prettier-ignore
var Foo2 = /*#__PURE__*/ function() {
    function Foo2() {
        _class_call_check._(this, Foo2);
    }
    _create_class._(Foo2, null, [
        {
            key: '',
            value: function value() {}
        }
    ]);
    return Foo2;
}();
// prettier-ignore
var C = function C() {
    _class_call_check._(this, C);
    _define_property._(this, "double", void 0);
    _define_property._(this, 'single', void 0);
};
