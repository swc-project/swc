//// [nullishCoalescingOperatorInParameterInitializer.ts]
var a = function() {};
!function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a();
}();
