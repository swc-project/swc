var _typeof = function(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
};
// @target: es5
var t1 = 10;
var t2 = 10;
var s;
// With templateHead
"hello ".concat(Math.pow(t1, t2));
"hello ".concat(Math.pow(t1, Math.pow(t2, t1)));
"hello ".concat(t1 + Math.pow(t2, t1));
"hello ".concat(Math.pow(t1, t2) + t1);
"hello ".concat(t1 + Math.pow(t2, t2) + t1);
"hello ".concat(_typeof(Math.pow(t1, Math.pow(t2, t1))));
"hello ".concat(1 + _typeof(Math.pow(t1, Math.pow(t2, t1))));
"hello ".concat(Math.pow(t1, t2)).concat(Math.pow(t1, t2));
"hello ".concat(Math.pow(t1, Math.pow(t2, t1))).concat(Math.pow(t1, Math.pow(t2, t1)));
"hello ".concat(t1 + Math.pow(t2, t1)).concat(t1 + Math.pow(t2, t1));
"hello ".concat(Math.pow(t1, t2) + t1).concat(Math.pow(t1, t2) + t1);
"hello ".concat(t1 + Math.pow(t2, t2) + t1).concat(t1 + Math.pow(t2, t2) + t1);
"hello ".concat(_typeof(Math.pow(t1, Math.pow(t2, t1)))).concat(_typeof(Math.pow(t1, Math.pow(t2, t1))));
"hello ".concat(Math.pow(t1, t2), " hello world ").concat(Math.pow(t1, t2));
"hello ".concat(Math.pow(t1, Math.pow(t2, t1)), " hello world ").concat(Math.pow(t1, Math.pow(t2, t1)));
"hello ".concat(t1 + Math.pow(t2, t1), " hello world ").concat(t1 + Math.pow(t2, t1));
"hello ".concat(Math.pow(t1, t2) + t1, " hello world ").concat(Math.pow(t1, t2) + t1);
"hello ".concat(t1 + Math.pow(t2, t2) + t1, " hello world ").concat(t1 + Math.pow(t2, t2) + t1);
"hello ".concat(_typeof(Math.pow(t1, Math.pow(t2, t1))), " hello world ").concat(_typeof(Math.pow(t1, Math.pow(t2, t1))));
