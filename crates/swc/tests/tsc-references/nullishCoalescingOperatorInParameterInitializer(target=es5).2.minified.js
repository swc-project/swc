//// [nullishCoalescingOperatorInParameterInitializer.ts]
var ref, a = function() {};
!function() {
    arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null !== (ref = a()) && ref;
}();
