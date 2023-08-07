//// [node.d.ts]
//// [a-ext.js]
exports.A = function() {
    this.x = 1;
};
//// [a.js]
require("./a-ext").A;
//// [b-ext.js]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var _class_call_check = require("@swc/helpers/_/_class_call_check");
exports.B = function _class() {
    _class_call_check._(this, _class), this.x = 1;
};
//// [b.js]
require("./b-ext").B;
//// [c-ext.js]
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
require("./c-ext").C;
//// [d-ext.js]
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
require("./d-ext").D;
//// [e-ext.js]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "E", {
    enumerable: !0,
    get: function() {
        return E;
    }
});
var _class_call_check = require("@swc/helpers/_/_class_call_check"), E = function E() {
    _class_call_check._(this, E), this.x = 1;
};
//// [e.js]
require("./e-ext").E;
//// [f.js]
//// [g.js]
//// [h.js]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), require("@swc/helpers/_/_class_call_check");
