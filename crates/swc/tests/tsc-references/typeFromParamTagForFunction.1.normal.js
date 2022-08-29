//// [node.d.ts]
"use strict";
//// [a-ext.js]
"use strict";
exports.A = function() {
    this.x = 1;
};
//// [a.js]
"use strict";
var A = require("./a-ext").A;
/** @param {A} p */ function a(p) {
    p.x;
}
//// [b-ext.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
exports.B = function _class() {
    "use strict";
    _classCallCheck(this, _class);
    this.x = 1;
};
//// [b.js]
"use strict";
var B = require("./b-ext").B;
/** @param {B} p */ function b(p) {
    p.x;
}
//// [c-ext.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "C", {
    enumerable: true,
    get: function() {
        return C;
    }
});
function C() {
    this.x = 1;
}
//// [c.js]
"use strict";
var C = require("./c-ext").C;
/** @param {C} p */ function c(p) {
    p.x;
}
//// [d-ext.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "D", {
    enumerable: true,
    get: function() {
        return D;
    }
});
var D = function D() {
    this.x = 1;
};
//// [d.js]
"use strict";
var D = require("./d-ext").D;
/** @param {D} p */ function d(p) {
    p.x;
}
//// [e-ext.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "E", {
    enumerable: true,
    get: function() {
        return E;
    }
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var E = function E() {
    "use strict";
    _classCallCheck(this, E);
    this.x = 1;
};
//// [e.js]
"use strict";
var E = require("./e-ext").E;
/** @param {E} p */ function e(p) {
    p.x;
}
//// [f.js]
"use strict";
var F = function F() {
    this.x = 1;
};
/** @param {F} p */ function f(p) {
    p.x;
}
//// [g.js]
"use strict";
function G() {
    this.x = 1;
}
/** @param {G} p */ function g(p) {
    p.x;
}
//// [h.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default;
var H = function H() {
    "use strict";
    _classCallCheck(this, H);
    this.x = 1;
};
/** @param {H} p */ function h(p) {
    p.x;
}
