var _call_super = require("@swc/helpers/_/_call_super");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _decorate = require("@swc/helpers/_/_decorate");
var _get = require("@swc/helpers/_/_get");
var _get_prototype_of = require("@swc/helpers/_/_get_prototype_of");
var _inherits = require("@swc/helpers/_/_inherits");
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
        function OtherClass() {
            _class_call_check._(this, OtherClass);
            var _this;
            _this = _call_super._(this, OtherClass, arguments);
            _initialize(_this);
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
