//// [genericCallWithFunctionTypedArguments5.ts]
// Generic call with parameter of object type with member of function type of n args passed object whose associated member is call signature with n+1 args
function foo(arg) {
    return arg.cb(null);
}
var arg = {
    cb: function(x) {
        return "";
    }
};
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
 // string
