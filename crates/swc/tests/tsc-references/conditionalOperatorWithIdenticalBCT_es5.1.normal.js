import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
//Cond ? Expr1 : Expr2,  Expr1 and Expr2 have identical best common type
var X = function X() {
    "use strict";
    _class_call_check(this, X);
};
var A = /*#__PURE__*/ function(X) {
    "use strict";
    _inherits(A, X);
    var _super = _create_super(A);
    function A() {
        _class_call_check(this, A);
        return _super.apply(this, arguments);
    }
    return A;
}(X);
var B = /*#__PURE__*/ function(X) {
    "use strict";
    _inherits(B, X);
    var _super = _create_super(B);
    function B() {
        _class_call_check(this, B);
        return _super.apply(this, arguments);
    }
    return B;
}(X);
var x;
var a;
var b;
//Cond ? Expr1 : Expr2,  Expr1 is supertype
//Be Not contextually typed
true ? x : a;
var result1 = true ? x : a;
//Expr1 and Expr2 are literals
true ? {} : 1;
true ? {
    a: 1
} : {
    a: 2,
    b: "string"
};
var result2 = true ? {} : 1;
var result3 = true ? {
    a: 1
} : {
    a: 2,
    b: "string"
};
//Contextually typed
var resultIsX1 = true ? x : a;
var result4 = true ? function(m) {
    return m.propertyX;
} : function(n) {
    return n.propertyA;
};
//Cond ? Expr1 : Expr2,  Expr2 is supertype
//Be Not contextually typed
true ? a : x;
var result5 = true ? a : x;
//Expr1 and Expr2 are literals
true ? 1 : {};
true ? {
    a: 2,
    b: "string"
} : {
    a: 1
};
var result6 = true ? 1 : {};
var result7 = true ? {
    a: 2,
    b: "string"
} : {
    a: 1
};
//Contextually typed
var resultIsX2 = true ? x : a;
var result8 = true ? function(m) {
    return m.propertyA;
} : function(n) {
    return n.propertyX;
};
//Result = Cond ? Expr1 : Expr2,  Result is supertype
//Contextually typed
var resultIsX3 = true ? a : b;
var result10 = true ? function(m) {
    return m.propertyX1;
} : function(n) {
    return n.propertyX2;
};
//Expr1 and Expr2 are literals
var result11 = true ? 1 : "string";
