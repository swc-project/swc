//// [nullishCoalescingOperatorInParameterBindingPattern.2.ts]
var ref, ref1, a = function() {};
(void 0)[null !== (ref = a()) && void 0 !== ref ? ref : "d"];
var x = "";
!function(param) {
    param[null !== (ref1 = a()) && void 0 !== ref1 ? ref1 : "d"], param.d;
}();
