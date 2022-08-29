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
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var _inherits = require("@swc/helpers/lib/_inherits.js").default;
var _wrapNativeSuper = require("@swc/helpers/lib/_wrap_native_super.js").default;
var _createSuper = require("@swc/helpers/lib/_create_super.js").default;
var Task = /*#__PURE__*/ function(Promise1) {
    "use strict";
    _inherits(Task, Promise1);
    var _super = _createSuper(Task);
    function Task() {
        _classCallCheck(this, Task);
        return _super.apply(this, arguments);
    }
    return Task;
}(_wrapNativeSuper(Promise));
//// [test.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default;
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var _tsGenerator = require("@swc/helpers/lib/_ts_generator.js").default;
var Test = /*#__PURE__*/ function() {
    "use strict";
    function Test() {
        _classCallCheck(this, Test);
    }
    var _proto = Test.prototype;
    _proto.example = function example() {
        return _asyncToGenerator(function() {
            return _tsGenerator(this, function(_state) {
                return [
                    2
                ];
            });
        })();
    };
    return Test;
}();
