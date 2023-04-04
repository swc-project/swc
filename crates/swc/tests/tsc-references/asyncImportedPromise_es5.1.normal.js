//// [task.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "Task", {
    enumerable: true,
    get: function() {
        return Task;
    }
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _inherits = require("@swc/helpers/_/_inherits");
var _wrap_native_super = require("@swc/helpers/_/_wrap_native_super");
var _create_super = require("@swc/helpers/_/_create_super");
var Task = /*#__PURE__*/ function(Promise1) {
    "use strict";
    _inherits._(Task, Promise1);
    var _super = _create_super._(Task);
    function Task() {
        _class_call_check._(this, Task);
        return _super.apply(this, arguments);
    }
    return Task;
}(_wrap_native_super._(Promise));
//// [test.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
var Test = /*#__PURE__*/ function() {
    "use strict";
    function Test() {
        _class_call_check._(this, Test);
    }
    var _proto = Test.prototype;
    _proto.example = function example() {
        return _async_to_generator._(function() {
            return _ts_generator._(this, function(_state) {
                return [
                    2
                ];
            });
        })();
    };
    return Test;
}();
