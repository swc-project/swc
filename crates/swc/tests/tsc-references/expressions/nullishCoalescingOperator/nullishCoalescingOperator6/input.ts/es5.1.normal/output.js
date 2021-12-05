// @strict: true
function foo(foo1) {
    var bar = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : foo1 !== null && foo1 !== void 0 ? foo1 : "bar";
}
