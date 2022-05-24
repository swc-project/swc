import _assert_this_initialized from "@swc/helpers/lib/_assert_this_initialized.js";
import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
import _decorate from "@swc/helpers/lib/_decorate.js";
import _get from "@swc/helpers/lib/_get.js";
import _get_prototype_of from "@swc/helpers/lib/_get_prototype_of.js";
import _inherits from "@swc/helpers/lib/_inherits.js";
import _create_super from "@swc/helpers/lib/_create_super.js";
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
