//// [parenthesizedContexualTyping2.ts]
// These tests ensure that in cases where it may *appear* that a value has a type,
// they actually are properly being contextually typed. The way we test this is
// that we invoke contextually typed arguments with type arguments.
// Since 'any' cannot be invoked with type arguments, we should get errors
// back if contextual typing is not taking effect.
function fun() {
    for(var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++)rest[_key] = arguments[_key];
}
fun(function(x) {
    return x(void 0), x;
}, 10), fun(function(x) {
    return x(void 0), x;
}, 10), fun(function(x) {
    return x(void 0), x;
}, 10), fun(function(x) {
    return x(void 0), x;
}, 10), fun(function(x) {
    return x(void 0), x;
}, function(x) {
    return x(void 0), x;
}, 10), fun(function(x) {
    return x(void 0), x;
}, function(x) {
    return x(void 0), x;
}, 10), fun(function(x) {
    return x(void 0), x;
}, function(x) {
    return x(void 0), x;
}, 10), fun(function(x) {
    return x(void 0), x;
}, function(x) {
    return x(void 0), x;
}, 10), fun(0.5 > Math.random() ? function(x) {
    return x(void 0), x;
} : function(x) {}, 10), fun(0.5 > Math.random() ? function(x) {
    return x(void 0), x;
} : function(x) {}, 10), fun(0.5 > Math.random() ? function(x) {
    return x(void 0), x;
} : function(x) {}, function(x) {
    return x(void 0), x;
}, 10), fun(0.5 > Math.random() ? function(x) {
    return x(void 0), x;
} : function(x) {}, function(x) {
    return x(void 0), x;
}, 10);
