//// [task.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "Task", {
    enumerable: !0,
    get: function() {
        return Task;
    }
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, _inherits = require("@swc/helpers/lib/_inherits.js").default, _wrapNativeSuper = require("@swc/helpers/lib/_wrap_native_super.js").default, _createSuper = require("@swc/helpers/lib/_create_super.js").default, Task = function(Promise1) {
    "use strict";
    _inherits(Task, Promise1);
    var _super = _createSuper(Task);
    function Task() {
        return _classCallCheck(this, Task), _super.apply(this, arguments);
    }
    return Task;
}(_wrapNativeSuper(Promise));
//// [test.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _asyncToGenerator = require("@swc/helpers/lib/_async_to_generator.js").default, _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, _tsGenerator = require("@swc/helpers/lib/_ts_generator.js").default, Test = function() {
    "use strict";
    function Test() {
        _classCallCheck(this, Test);
    }
    return Test.prototype.example = function() {
        return _asyncToGenerator(function() {
            return _tsGenerator(this, function(_state) {
                return [
                    2
                ];
            });
        })();
    }, Test;
}();
