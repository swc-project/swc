//// [foo1.ts]
"use strict";
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var x = function x() {
    "use strict";
    _class_call_check._(this, x);
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
    value: true
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _inherits = require("@swc/helpers/_/_inherits");
var _create_super = require("@swc/helpers/_/_create_super");
var foo2 = require("./foo2");
var x = /*#__PURE__*/ function(_foo2_x) {
    "use strict";
    _inherits._(x, _foo2_x);
    var _super = _create_super._(x);
    function x() {
        _class_call_check._(this, x);
        return _super.apply(this, arguments);
    }
    return x;
}(foo2.x);
