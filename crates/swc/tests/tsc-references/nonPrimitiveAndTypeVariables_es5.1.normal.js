var a = {
    a: 0
};
var b = {
    a: 0
};
function foo(x) {
    var a = x; // Error
    var b = x; // Error
}
