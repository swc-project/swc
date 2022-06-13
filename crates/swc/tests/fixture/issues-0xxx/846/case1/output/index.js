import _assert_this_initialized from "@swc/helpers/src/_assert_this_initialized.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _decorate from "@swc/helpers/src/_decorate.mjs";
import _get from "@swc/helpers/src/_get.mjs";
import _get_prototype_of from "@swc/helpers/src/_get_prototype_of.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
var SomeClass = _decorate([], function(_initialize) {
    var SomeClass = function SomeClass() {
        "use strict";
        _class_call_check(this, SomeClass);
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
var OtherClass = _decorate([], function(_initialize, _SomeClass1) {
    var OtherClass = /*#__PURE__*/ function(_SomeClass) {
        "use strict";
        _inherits(OtherClass, _SomeClass);
        var _super = _create_super(OtherClass);
        function OtherClass() {
            _class_call_check(this, OtherClass);
            var _this;
            _this = _super.apply(this, arguments);
            _initialize(_assert_this_initialized(_this));
            return _this;
        }
        return OtherClass;
    }(_SomeClass1);
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
                    _get(_get_prototype_of(OtherClass.prototype), "someMethod", this).call(this);
                }
            }
        ]
    };
}, SomeClass);
