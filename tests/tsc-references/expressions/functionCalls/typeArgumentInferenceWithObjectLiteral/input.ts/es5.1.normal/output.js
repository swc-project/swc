function foo(x) {
}
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
var E11;
(function(E1) {
    E1[E1["X"] = 0] = "X";
})(E11 || (E11 = {
}));
var E21;
(function(E2) {
    E2[E2["X"] = 0] = "X";
})(E21 || (E21 = {
}));
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
}, E11.X);
var v1 = f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return E11.X;
    }
}, 0);
var v2;
var v2 = f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return E11.X;
    }
}, E11.X);
var v3 = f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return E11.X;
    }
}, E21.X); // Error
