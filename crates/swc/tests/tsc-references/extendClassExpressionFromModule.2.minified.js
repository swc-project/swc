//// [foo1.ts]
"use strict";
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, x = function x() {
    "use strict";
    _classCallCheck(this, x);
};
module.exports = x;
//// [foo2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, _inherits = require("@swc/helpers/lib/_inherits.js").default, _createSuper = require("@swc/helpers/lib/_create_super.js").default;
!function(x) {
    "use strict";
    _inherits(y, x);
    var _super = _createSuper(y);
    function y() {
        return _classCallCheck(this, y), _super.apply(this, arguments);
    }
    return y;
}(require("./foo1"));
