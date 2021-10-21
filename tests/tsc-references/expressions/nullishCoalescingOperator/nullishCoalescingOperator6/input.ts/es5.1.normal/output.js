// @strict: true
function foo1(foo, param) {
    var bar = param === void 0 ? foo !== null && foo !== void 0 ? foo : "bar" : param;
}
