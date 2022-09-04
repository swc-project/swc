//// [parenthesizedContexualTyping1.ts]
(0.5 > Math.random() ? function(x) {
    return x;
} : function(x) {})(10), (0.5 > Math.random() ? function(x) {
    return x;
} : function(x) {})(10), (0.5 > Math.random() ? function(x) {
    return x;
} : function(x) {})(function(x) {
    return x;
}), (0.5 > Math.random() ? function(x) {
    return x;
} : function(x) {})(function(x) {
    return x;
});
