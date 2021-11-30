// @strict: true
function foo1(foo) {
    var bar = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : foo !== null && foo !== void 0 ? foo : "bar";
}
