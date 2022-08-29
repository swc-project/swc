//// [node.d.ts]
"use strict";
//// [a-ext.js]
"use strict";
exports.A = function() {
    this.x = 1;
};
//// [a.js]
"use strict";
require("./a-ext").A;
//// [b-ext.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
exports.B = function _class() {
    "use strict";
    _classCallCheck(this, _class), this.x = 1;
};
//// [b.js]
"use strict";
require("./b-ext").B;
//// [c-ext.js]
"use strict";
function C() {
    this.x = 1;
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "C", {
    enumerable: !0,
    get: function() {
        return C;
    }
});
//// [c.js]
"use strict";
require("./c-ext").C;
//// [d-ext.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "D", {
    enumerable: !0,
    get: function() {
        return D;
    }
});
var D = function() {
    this.x = 1;
};
//// [d.js]
"use strict";
require("./d-ext").D;
//// [e-ext.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "E", {
    enumerable: !0,
    get: function() {
        return E;
    }
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, E = function E() {
    "use strict";
    _classCallCheck(this, E), this.x = 1;
};
//// [e.js]
"use strict";
require("./e-ext").E;
//// [f.js]
"use strict";
//// [g.js]
"use strict";
//// [h.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), require("@swc/helpers/lib/_class_call_check.js").default;
