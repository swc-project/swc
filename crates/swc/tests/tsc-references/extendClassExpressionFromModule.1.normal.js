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
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _inherits = require("@swc/helpers/_/_inherits");
var _create_super = require("@swc/helpers/_/_create_super");
var foo1 = require("./foo1");
var x = foo1;
var y = /*#__PURE__*/ function(x) {
    "use strict";
    _inherits._(y, x);
    var _super = _create_super._(y);
    function y() {
        _class_call_check._(this, y);
        return _super.apply(this, arguments);
    }
    return y;
}(x);
