//// [parenthesizedContexualTyping2.ts]
function fun() {
    for(var _len = arguments.length, rest = Array(_len), _key = 0; _key < _len; _key++)rest[_key] = arguments[_key];
}
var a = fun(function(x) {
    return x(void 0), x;
}, 10), b = fun(function(x) {
    return x(void 0), x;
}, 10), c = fun(function(x) {
    return x(void 0), x;
}, 10), d = fun(function(x) {
    return x(void 0), x;
}, 10), e = fun(function(x) {
    return x(void 0), x;
}, function(x) {
    return x(void 0), x;
}, 10), f = fun(function(x) {
    return x(void 0), x;
}, function(x) {
    return x(void 0), x;
}, 10), g = fun(function(x) {
    return x(void 0), x;
}, function(x) {
    return x(void 0), x;
}, 10), h = fun(function(x) {
    return x(void 0), x;
}, function(x) {
    return x(void 0), x;
}, 10), i = fun(0.5 > Math.random() ? function(x) {
    return x(void 0), x;
} : function(x) {}, 10), j = fun(0.5 > Math.random() ? function(x) {
    return x(void 0), x;
} : function(x) {}, 10), k = fun(0.5 > Math.random() ? function(x) {
    return x(void 0), x;
} : function(x) {}, function(x) {
    return x(void 0), x;
}, 10), l = fun(0.5 > Math.random() ? function(x) {
    return x(void 0), x;
} : function(x) {}, function(x) {
    return x(void 0), x;
}, 10), lambda1 = function(x) {
    return x(void 0), x;
}, lambda2 = function(x) {
    return x(void 0), x;
}, obj1 = {
    x: function(x) {},
    y: function(y) {}
}, obj2 = {
    x: function(x) {},
    y: function(y) {}
};
