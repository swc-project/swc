function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg), value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    info.done ? resolve(value) : Promise.resolve(value).then(_next, _throw);
}
function fun(deepPromised) {
    return _fun.apply(this, arguments);
}
function _fun() {
    return (_fun = (function(fn) {
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
                _next(void 0);
            });
        };
    })(function*(deepPromised) {
        for (const value of Object.values(deepPromised)){
            const awaitedValue = yield value;
            awaitedValue && (yield fun(awaitedValue));
        }
    })).apply(this, arguments);
}
f1(1, 2), f1(1, "hello"), f1(1, sn), f1(void 0, "abc"), f1("foo", "bar"), f1(!0, !1), f1("hello", 1), f2([
    "string",
    !0
]), f3(5), f3(sn), f3(!0), f3(b), f3("abc"), f4("abc"), f4(s), f4(42), foo(x), bar(1, 2), Symbol(), baz(xx);
export { };
