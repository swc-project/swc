import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _decorate } from "@swc/helpers/_/_decorate";
import { _ as _get } from "@swc/helpers/_/_get";
import { _ as _get_prototype_of } from "@swc/helpers/_/_get_prototype_of";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
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
        function OtherClass() {
            _class_call_check(this, OtherClass);
            var _this;
            _this = _call_super(this, OtherClass, arguments);
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
                    _get(_get_prototype_of(OtherClass.prototype), "someMethod", this).call(this);
                }
            }
        ]
    };
}, SomeClass);
