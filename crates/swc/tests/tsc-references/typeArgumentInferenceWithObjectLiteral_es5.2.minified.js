var s, E1, E2;
function foo(x) {}
foo({
    read: function() {
        return s;
    },
    write: function(value) {
        return s = value;
    }
}), foo({
    write: function(value) {
        return s = value;
    },
    read: function() {
        return s;
    }
}), function(E1) {
    E1[E1.X = 0] = "X";
}(E1 || (E1 = {})), function(E2) {
    E2[E2.X = 0] = "X";
}(E2 || (E2 = {})), f1({
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
}, E1.X), f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return E1.X;
    }
}, 0), f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return E1.X;
    }
}, E1.X), f1({
    w: function(x) {
        return x;
    },
    r: function() {
        return E1.X;
    }
}, E2.X);
