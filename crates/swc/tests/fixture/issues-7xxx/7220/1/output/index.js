import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _apply_decs_2203_r } from "@swc/helpers/_/_apply_decs_2203_r";
var __ = new WeakMap();
var _dec, _initProto;
var _BOUND_FUNCTIONS = {};
export var BackgroundJob = function BackgroundJob() {
    "use strict";
    _class_call_check(this, BackgroundJob);
};
_dec = BackgroundJob.bind;
var TestClass = /*#__PURE__*/ function() {
    "use strict";
    function TestClass() {
        _class_call_check(this, TestClass);
        _define_property(this, "calls", (_initProto(this), []));
    }
    _create_class(TestClass, [
        {
            key: "success",
            value: function success(s, n) {
                this.calls.push("success(".concat(s, ", ").concat(n, ")"));
                return Promise.resolve();
            }
        }
    ]);
    return TestClass;
}();
__.set(TestClass, {
    writable: true,
    value: { e: [_initProto] } = _apply_decs_2203_r(TestClass, [
        [
            _dec,
            2,
            "success"
        ]
    ], [])
});
