import _type_of from "@swc/helpers/lib/_type_of.js";
// @target: es6
var t1 = 10;
var t2 = 10;
var s;
// TempateHead & TemplateTail are empty
"".concat(Math.pow(t1, t2));
"".concat(Math.pow(t1, Math.pow(t2, t1)));
"".concat(t1 + Math.pow(t2, t1));
"".concat(Math.pow(t1, t2) + t1);
"".concat(t1 + Math.pow(t2, t2) + t1);
"".concat(_type_of(Math.pow(t1, Math.pow(t2, t1))));
"".concat(1 + _type_of(Math.pow(t1, Math.pow(t2, t1))));
"".concat(Math.pow(t1, t2)).concat(Math.pow(t1, t2));
"".concat(Math.pow(t1, Math.pow(t2, t1))).concat(Math.pow(t1, Math.pow(t2, t1)));
"".concat(t1 + Math.pow(t2, t1)).concat(t1 + Math.pow(t2, t1));
"".concat(Math.pow(t1, t2) + t1).concat(Math.pow(t1, t2) + t1);
"".concat(t1 + Math.pow(t2, t2) + t1).concat(t1 + Math.pow(t2, t2) + t1);
"".concat(_type_of(Math.pow(t1, Math.pow(t2, t1)))).concat(_type_of(Math.pow(t1, Math.pow(t2, t1))));
"".concat(Math.pow(t1, t2), " hello world ").concat(Math.pow(t1, t2));
"".concat(Math.pow(t1, Math.pow(t2, t1)), " hello world ").concat(Math.pow(t1, Math.pow(t2, t1)));
"".concat(t1 + Math.pow(t2, t1), " hello world ").concat(t1 + Math.pow(t2, t1));
"".concat(Math.pow(t1, t2) + t1, " hello world ").concat(Math.pow(t1, t2) + t1);
"".concat(t1 + Math.pow(t2, t2) + t1, " hello world ").concat(t1 + Math.pow(t2, t2) + t1);
"".concat(_type_of(Math.pow(t1, Math.pow(t2, t1))), " hello world ").concat(_type_of(Math.pow(t1, Math.pow(t2, t1))));
