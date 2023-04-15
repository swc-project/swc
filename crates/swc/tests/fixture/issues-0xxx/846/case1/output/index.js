import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _decorate } from "@swc/helpers/_/_decorate";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
var OtherClass = _decorate([], function(_initialize, _SomeClass) {
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
                    _get(_get_prototype_of(OtherClass.prototype), "someMethod", this).call(this);
                }
            }
        ]
    };
}, SomeClass);
