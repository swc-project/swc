// @strict: true
function foo(foo, param) {
    var bar = param === void 0 ? foo !== null && foo !== void 0 ? foo : "bar" : param;
}
