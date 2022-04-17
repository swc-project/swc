import * as swcHelpers from "@swc/helpers";
function fun(deepPromised) {
    return _fun.apply(this, arguments);
}
function _fun() {
    return (_fun = swcHelpers.asyncToGenerator(function*(deepPromised) {
        for (let value of Object.values(deepPromised)){
            let awaitedValue = yield value;
            awaitedValue && (yield fun(awaitedValue));
        }
    })).apply(this, arguments);
}
f1(1, 2), f1(1, "hello"), f1(1, sn), f1(void 0, "abc"), f1("foo", "bar"), f1(!0, !1), f1("hello", 1), f2([
    "string",
    !0
]), f3(5), f3(sn), f3(!0), f3(b), f3("abc"), f4("abc"), f4(s), f4(42), foo(x), bar(1, 2), Symbol(), baz(xx);
