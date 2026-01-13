//// [typeArgumentInferenceWithObjectLiteral.ts]
function foo(x) {}
var s;
// Calls below should infer string for T and then assign that type to the value parameter
foo({
    read: function() {
        return s;
    },
    write: function(value) {
        return s = value;
    }
});
foo({
    write: function(value) {
        return s = value;
    },
    read: function() {
        return s;
    }
});
var E1 = /*#__PURE__*/ function(E1) {
    E1[E1["X"] = 0] = "X";
    return E1;
}(E1 || {});
var E2 = /*#__PURE__*/ function(E2) {
    E2[E2["X"] = 0] = "X";
    return E2;
}(E2 || {});
var v1;
var v1 = f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return 0;
    }
}, 0);
var v1 = f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return 0;
    }
}, 0);
var v1 = f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return 0;
    }
}, 0);
var v2;
var v2 = f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return 0;
    }
}, 0);
var v3 = f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return 0;
    }
}, 0); // Error
