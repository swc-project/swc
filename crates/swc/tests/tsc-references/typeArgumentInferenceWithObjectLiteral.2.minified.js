//// [typeArgumentInferenceWithObjectLiteral.ts]
var E1, E2;
(E1 = {})[E1.X = 0] = "X", (E2 = {})[E2.X = 0] = "X", f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return 0;
    }
}, 0), f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return 0;
    }
}, 0), f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return 0;
    }
}, 0), f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return 0;
    }
}, 0), f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return 0;
    }
}, 0);
