//// [nullishCoalescingOperatorInParameterInitializer.2.ts]
var ref, ref1, a = function() {};
!function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null !== (ref = a()) && ref;
}(), function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null !== (ref1 = a()) && ref1, arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
}();
