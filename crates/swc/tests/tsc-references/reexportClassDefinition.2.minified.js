//// [foo1.ts]
"use strict";
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, x = function x() {
    "use strict";
    _classCallCheck(this, x);
};
module.exports = x;
//// [foo2.ts]
"use strict";
var foo1 = require("./foo1");
module.exports = {
    x: foo1
};
//// [foo3.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, _inherits = require("@swc/helpers/lib/_inherits.js").default, _createSuper = require("@swc/helpers/lib/_create_super.js").default, foo2 = require("./foo2"), x = function(_x) {
    "use strict";
    _inherits(x, _x);
    var _super = _createSuper(x);
    function x() {
        return _classCallCheck(this, x), _super.apply(this, arguments);
    }
    return x;
}(foo2.x);
