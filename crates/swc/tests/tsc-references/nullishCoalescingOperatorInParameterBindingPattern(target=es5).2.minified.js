//// [nullishCoalescingOperatorInParameterBindingPattern.ts]
var ref, a = function() {};
(void 0)[null !== (ref = a()) && void 0 !== ref ? ref : "d"];
