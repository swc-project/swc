//// [contextualTypeTupleEnd.ts]
f1(); // Error
f1(function(x) {
    return str(x);
});
f1(function(x) {
    return num(x);
}, function(x) {
    return str(x);
});
f1(function(x) {
    return num(x);
}, function(x) {
    return num(x);
}, function(x) {
    return str(x);
});
var a0 = []; // Error
var a1 = [
    function(x) {
        return str(x);
    }
];
var a2 = [
    function(x) {
        return num(x);
    },
    function(x) {
        return str(x);
    }
];
var a3 = [
    function(x) {
        return num(x);
    },
    function(x) {
        return num(x);
    },
    function(x) {
        return str(x);
    }
];
export function createSelector() {
    for(var _len = arguments.length, selectors = new Array(_len), _key = 0; _key < _len; _key++){
        selectors[_key] = arguments[_key];
    }
    console.log(selectors);
}
createSelector(function(x) {
    return x.foo;
}, function(x) {
    return x.bar;
}, function() {
    return 42;
});
example(function(x) {
    return x.foo;
}, function(x) {
    return x.bar;
}, function(x) {
    return x.baz;
});
test(function(a) {
    return a;
}, function(b) {
    return b;
}, function(c) {
    return c;
});
