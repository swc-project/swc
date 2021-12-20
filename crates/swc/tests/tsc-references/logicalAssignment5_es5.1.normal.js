// @strict: true
// @target: esnext, es2020, es2015
function foo1(f) {
    f !== null && f !== void 0 ? f : f = function(a) {
        return a;
    };
    f(42);
}
function foo2(f) {
    f || (f = function(a) {
        return a;
    });
    f(42);
}
function foo3(f) {
    f &&= function(a) {
        return a;
    };
    f(42);
}
function bar1(f) {
    f !== null && f !== void 0 ? f : f = (f.toString(), function(a) {
        return a;
    });
    f(42);
}
function bar2(f) {
    f || (f = (f.toString(), function(a) {
        return a;
    }));
    f(42);
}
function bar3(f) {
    f &&= (f.toString(), function(a) {
        return a;
    });
    f(42);
}
