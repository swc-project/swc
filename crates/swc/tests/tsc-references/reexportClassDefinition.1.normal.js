//// [foo1.ts]
"use strict";
var _class_call_check = require("@swc/helpers/lib/_class_call_check.js").default;
var x = function x() {
    "use strict";
    _class_call_check(this, x);
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
var _class_call_check = require("@swc/helpers/lib/_class_call_check.js").default;
var _inherits = require("@swc/helpers/lib/_inherits.js").default;
var _create_super = require("@swc/helpers/lib/_create_super.js").default;
var foo2 = require("./foo2");
var x = /*#__PURE__*/ function(_foo2_x) {
    "use strict";
    _inherits(x, _foo2_x);
    var _super = _create_super(x);
    function x() {
        _class_call_check(this, x);
        return _super.apply(this, arguments);
    }
    return x;
}(foo2.x);
