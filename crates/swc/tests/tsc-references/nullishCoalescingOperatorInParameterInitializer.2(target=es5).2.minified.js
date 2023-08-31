//// [nullishCoalescingOperatorInParameterInitializer.2.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var a = function() {};
!function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a();
}(), function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a(), arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}();
