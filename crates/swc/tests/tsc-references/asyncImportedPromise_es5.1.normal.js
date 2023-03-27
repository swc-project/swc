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
var _class_call_check = require("@swc/helpers/lib/_class_call_check.js").default;
var _inherits = require("@swc/helpers/lib/_inherits.js").default;
var _wrap_native_super = require("@swc/helpers/lib/_wrap_native_super.js").default;
var _create_super = require("@swc/helpers/lib/_create_super.js").default;
var Task = /*#__PURE__*/ function(Promise1) {
    "use strict";
    _inherits(Task, Promise1);
    var _super = _create_super(Task);
    function Task() {
        _class_call_check(this, Task);
        return _super.apply(this, arguments);
    }
    return Task;
}(_wrap_native_super(Promise));
//// [test.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _async_to_generator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _class_call_check = require("@swc/helpers/lib/_class_call_check.js").default;
var _ts_generator = require("@swc/helpers/lib/_ts_generator.js").default;
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
