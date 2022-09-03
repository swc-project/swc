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
function a(p) {
    p.x;
}
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
var B = require("./b-ext").B;
function b(p) {
    p.x;
}
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
var C = require("./c-ext").C;
function c(p) {
    p.x;
}
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
var D = require("./d-ext").D;
function d(p) {
    p.x;
}
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
var E = require("./e-ext").E;
function e(p) {
    p.x;
}
//// [f.js]
"use strict";
var F = function() {
    this.x = 1;
};
function f(p) {
    p.x;
}
//// [g.js]
"use strict";
function G() {
    this.x = 1;
}
function g(p) {
    p.x;
}
//// [h.js]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _classCallCheck = require("@swc/helpers/lib/_class_call_check.js").default, H = function H() {
    "use strict";
    _classCallCheck(this, H), this.x = 1;
};
function h(p) {
    p.x;
}
