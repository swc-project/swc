//// [foo1.ts]
"use strict";
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var x = function x() {
    "use strict";
    _classCallCheck(this, x);
};
module.exports = x;
//// [foo2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var _inherits = require("@swc/helpers/lib/_inherits.js").default;
var _createSuper = require("@swc/helpers/lib/_create_super.js").default;
var foo1 = require("./foo1");
var x = foo1;
var y = /*#__PURE__*/ function(x) {
    "use strict";
    _inherits(y, x);
    var _super = _createSuper(y);
    function y() {
        _classCallCheck(this, y);
        return _super.apply(this, arguments);
    }
    return y;
}(x);
