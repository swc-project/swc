// @strict: true
function foo(foo) {
    var bar = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : foo !== null && foo !== void 0 ? foo : "bar";
}
