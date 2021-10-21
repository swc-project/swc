function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
var // When a function expression with no type parameters and no parameter type annotations 
// is contextually typed (section 4.19) by a type T and a contextual signature S can be extracted from T
E1;
(function(E) {
    E[E["red"] = 0] = "red";
    E[E["blue"] = 1] = "blue";
})(E1 || (E1 = {
}));
// A contextual signature S is extracted from a function type T as follows:
//      If T is a function type with exactly one call signature, and if that call signature is non- generic, S is that signature.
var a0 = function(num, str) {
    num.toExponential();
    return 0;
};
var Class = /*#__PURE__*/ function() {
    "use strict";
    function Class() {
        _classCallCheck(this, Class);
    }
    _createClass(Class, [
        {
            key: "foo",
            value: function foo() {
            }
        }
    ]);
    return Class;
}();
var a11 = function(a1) {
    a1.foo();
    return 1;
};
// A contextual signature S is extracted from a function type T as follows:
//      If T is a union type, let U be the set of element types in T that have call signatures.
//        If each type in U has exactly one call signature and that call signature is non- generic,
//        and if all of the signatures are identical ignoring return types,
//        then S is a signature with the same parameters and a union of the return types.
var b1;
b1 = function(k, h) {
};
var b2;
b2 = function(foo, bar) {
    return foo + 1;
};
b2 = function(foo, bar) {
    return "hello";
};
var b3;
b3 = function(name, number) {
};
var b4 = function(param) {
    var number = param === void 0 ? 1 : param;
    return "hello";
};
var b5 = function(param) {
    var number = param === void 0 ? "string" : param;
    return "hello";
};
// A contextual signature S is extracted from a function type T as follows:
//      Otherwise, no contextual signature can be extracted from T and S is undefined.
var b6;
var b7;
b6 = function(k) {
    k.toLowerCase();
};
b6 = function(i) {
    i.toExponential();
    return i;
}; // Per spec, no contextual signature can be extracted in this case. (Otherwise clause)
b7 = function(j, m) {
}; // Per spec, no contextual signature can be extracted in this case. (Otherwise clause)
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
    var k1 = function(j, k) {
        return [
            j,
            k
        ];
    } // Per spec, no contextual signature can be extracted in this case.
    ;
};
