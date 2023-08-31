//// [nullishCoalescingOperatorInParameterInitializer.ts]
// https://github.com/microsoft/TypeScript/issues/36295
var a = function() {};
!function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a();
}();
