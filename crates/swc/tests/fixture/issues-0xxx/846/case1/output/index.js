var _assert_this_initialized = require("@swc/helpers/_/_assert_this_initialized");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _decorate = require("@swc/helpers/_/_decorate");
var _get = require("@swc/helpers/_/_get");
var _get_prototype_of = require("@swc/helpers/_/_get_prototype_of");
var _inherits = require("@swc/helpers/_/_inherits");
var _create_super = require("@swc/helpers/_/_create_super");
var SomeClass = _decorate._([], function(_initialize) {
    "use strict";
    var SomeClass = function SomeClass() {
        "use strict";
        _class_call_check._(this, SomeClass);
        _initialize(this);
    };
    return {
        F: SomeClass,
        d: [
            {
                kind: "method",
                decorators: [
                    dec
                ],
                key: "someMethod",
                value: function someMethod() {}
            }
        ]
    };
});
var OtherClass = _decorate._([], function(_initialize, _SomeClass) {
    "use strict";
    var OtherClass = /*#__PURE__*/ function(_SomeClass) {
        "use strict";
        _inherits._(OtherClass, _SomeClass);
        var _super = _create_super._(OtherClass);
        function OtherClass() {
            _class_call_check._(this, OtherClass);
            var _this;
            _this = _super.apply(this, arguments);
            _initialize(_assert_this_initialized._(_this));
            return _this;
        }
        return OtherClass;
    }(_SomeClass);
    return {
        F: OtherClass,
        d: [
            {
                kind: "method",
                decorators: [
                    dec
                ],
                key: "anotherMethod",
                value: function anotherMethod() {
                    _get._(_get_prototype_of._(OtherClass.prototype), "someMethod", this).call(this);
                }
            }
        ]
    };
}, SomeClass);
