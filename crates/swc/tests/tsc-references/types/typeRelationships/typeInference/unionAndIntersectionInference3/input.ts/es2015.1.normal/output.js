function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
concatMaybe([
    1,
    2,
    3
], 4);
// Repros from #32247
const g = _asyncToGenerator(function*(com) {
    throw com;
});
f1 = f2;
f2 = f1;
g1 = g2;
g2 = g1;
let x1 = foo1(sa); // string
let y1 = foo1(sx); // string
let x2 = foo2(sa); // unknown
let y2 = foo2(sx); // { extra: number }
withRouter(MyComponent);
let z = foo(ab); // [AB<string>, string]
// @strict: true
// @target: esnext
// Repro from #30720
export { };
