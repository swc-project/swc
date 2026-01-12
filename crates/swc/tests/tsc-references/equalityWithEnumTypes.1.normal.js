//// [equalityWithEnumTypes.ts]
// Literal enum type
var E1 = /*#__PURE__*/ function(E1) {
    E1[E1["a"] = 1] = "a";
    E1[E1["b"] = 2] = "b";
    return E1;
}(E1 || {});
// Numeric enum type
var E2 = /*#__PURE__*/ function(E2) {
    E2[E2["a"] = 1] = "a";
    E2[E2["b"] = 2] = "b";
    return E2;
}(E2 || {});
function f1(v) {
    if (v !== 0) {
        v;
    }
    if (v !== 1) {
        v;
    }
    if (v !== 2) {
        v;
    }
    if (v !== 3) {
        v;
    }
}
function f2(v) {
    if (v !== 0) {
        v;
    }
    if (v !== 1) {
        v;
    }
    if (v !== 2) {
        v;
    }
    if (v !== 3) {
        v;
    }
}
