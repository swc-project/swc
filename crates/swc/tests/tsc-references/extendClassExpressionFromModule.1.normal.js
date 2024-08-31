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
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _call_super = require("@swc/helpers/_/_call_super");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _inherits = require("@swc/helpers/_/_inherits");
var foo1 = require("./foo1");
var x = foo1;
var y = /*#__PURE__*/ function(x) {
    "use strict";
    _inherits._(y, x);
    function y() {
        _class_call_check._(this, y);
        return _call_super._(this, y, arguments);
    }
    return y;
}(x);
