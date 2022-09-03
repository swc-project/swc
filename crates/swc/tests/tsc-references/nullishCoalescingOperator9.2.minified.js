//// [nullishCoalescingOperator9.ts]
var g = f || function(abc) {
    abc.toLowerCase();
}, gg = null != f ? f : function(abc) {
    abc.toLowerCase();
};
