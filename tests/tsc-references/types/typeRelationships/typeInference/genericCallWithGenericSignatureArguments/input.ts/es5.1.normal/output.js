// When a function expression is inferentially typed (section 4.9.3) and a type assigned to a parameter in that expression references type parameters for which inferences are being made, 
// the corresponding inferred type arguments to become fixed and no further candidate inferences are made for them.
function foo(a, b) {
    var r;
    return r;
}
//var r1 = foo((x: number) => 1, (x: string) => ''); // error
var r1b = foo(function(x) {
    return 1;
}, function(x) {
    return '';
}); // {} => {}
var r2 = foo(function(x) {
    return null;
}, function(x) {
    return '';
}); // Object => Object
var r3 = foo(function(x) {
    return 1;
}, function(x) {
    return null;
}); // number => number
var r3ii = foo(function(x) {
    return 1;
}, function(x) {
    return 1;
}); // number => number
var a1;
var b1;
var r4 = foo(function(x) {
    return a1;
}, function(x) {
    return b1;
}); // typeof a => typeof a
var r5 = foo(function(x) {
    return b1;
}, function(x) {
    return a1;
}); // typeof b => typeof b
function other(x) {
    var r6 = foo(function(a) {
        return a;
    }, function(b) {
        return b;
    }); // T => T
    var r6b = foo(function(a) {
        return a;
    }, function(b) {
        return b;
    }); // {} => {}
}
function other2(x) {
    var r7 = foo(function(a) {
        return a;
    }, function(b) {
        return b;
    }); // T => T
    var r7b = foo(function(a) {
        return a;
    }, function(b) {
        return b;
    }); // {} => {}
    var r8 = r7(null);
// BUG 835518
//var r9 = r7(new Date());
}
function foo2(a, b) {
    var r;
    return r;
}
function other3(x) {
    var r8 = foo2(function(a) {
        return a;
    }, function(b) {
        return b;
    }); // Date => Date
}
