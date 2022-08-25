// @target: es6
// @module: commonjs
// @filename: task.ts
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _wrap_native_super from "@swc/helpers/src/_wrap_native_super.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
export var Task = /*#__PURE__*/ function(Promise1) {
    "use strict";
    _inherits(Task, Promise1);
    var _super = _create_super(Task);
    function Task() {
        _class_call_check(this, Task);
        return _super.apply(this, arguments);
    }
    return Task;
}(_wrap_native_super(Promise));
// @filename: test.ts
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var Test = /*#__PURE__*/ function() {
    "use strict";
    function Test() {
        _class_call_check(this, Test);
    }
    var _proto = Test.prototype;
    _proto.example = function example() {
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                return [
                    2
                ];
            });
        })();
    };
    return Test;
}();
export { };
