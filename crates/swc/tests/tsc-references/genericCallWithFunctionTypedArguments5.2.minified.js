//// [genericCallWithFunctionTypedArguments5.ts]
function foo(arg) {
    return arg.cb(null);
}
var arg = {};
foo(arg), foo({
    cb: function(x, y) {
        return "";
    }
}), foo({
    cb: function(x, y) {
        return "";
    }
}), foo(arg), foo({
    cb: function(x) {
        return "";
    }
}), foo({
    cb: function(x) {
        return "";
    }
}), foo({
    cb: function() {
        return "";
    }
});
