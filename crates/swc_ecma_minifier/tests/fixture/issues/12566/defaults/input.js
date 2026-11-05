(function () {
    function* gen(label) {
        console.log(label);
        yield 1;
    }

    // A function whose return value is ignored becomes an empty IIFE.
    function first(a) {
        return a;
    }
    first(1, ...gen("inlined call"));

    // Empty function expressions, as a statement, in a sequence and with `new`.
    (function (a) {})(1, ...gen("empty callee"));
    (function (a) {})(1, ...gen("sequence")), console.log("after sequence");
    new (function (a) {})(1, ...gen("new"));

    Date(...gen("Date"));
    Math.max(...gen("Math.max"));
    "".concat(...gen("string method"));

    // An empty stub consumes the iterator it is spread with.
    function noop() {}
    const it = [1, 2][Symbol.iterator]();
    noop(...it);
    console.log(it.next().done);

    // Spreading a non-iterable value throws.
    function second(a) {
        return a;
    }
    try {
        second(1, ...null);
        console.log("no error");
    } catch (e) {
        console.log(e.name);
    }
    try {
        Math.max(...null);
        console.log("no error");
    } catch (e) {
        console.log(e.name);
    }

    try {
        new (class {})(...null);
        console.log("no error");
    } catch (e) {
        console.log(e.name);
    }
    try {
        (function () {})?.(...null);
        console.log("no error");
    } catch (e) {
        console.log(e.name);
    }

    // A call or `new` annotated as pure also spreads its arguments.
    const api = { h() {}, H: function () {} };
    var annotated = /*#__PURE__*/ api.h(...gen("annotated call"));
    var annotatedNew = /*#__PURE__*/ new api.H(...gen("annotated new"));
    try {
        var annotatedNull = /*#__PURE__*/ api.h(...null);
        console.log("no error");
    } catch (e) {
        console.log(e.name);
    }

    // Ordinary arguments of an empty callee are still evaluated.
    function ordinary() {
        console.log("ordinary");
        return 1;
    }
    (function (a) {})(ordinary());
})();
