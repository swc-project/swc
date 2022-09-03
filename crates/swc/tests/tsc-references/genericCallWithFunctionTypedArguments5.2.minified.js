//// [genericCallWithFunctionTypedArguments5.ts]
function foo(arg) {
    return arg.cb(null);
}
var arg = {
    cb: function(x) {
        return "";
    }
}, r = foo(arg), r2 = foo({
    cb: function(x, y) {
        return "";
    }
}), r3 = foo({
    cb: function(x, y) {
        return "";
    }
});
function foo2(arg) {
    return arg.cb(null, null);
}
var r4 = foo(arg), r5 = foo({
    cb: function(x) {
        return "";
    }
}), r6 = foo({
    cb: function(x) {
        return "";
    }
}), r7 = foo({
    cb: function() {
        return "";
    }
});
