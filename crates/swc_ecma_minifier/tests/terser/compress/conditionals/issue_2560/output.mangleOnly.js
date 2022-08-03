function n(n) {
    console.log(n);
}
function o() {
    return n;
}
function f() {
    if (i !== (i = o())) {
        i(1);
    } else {
        i(2);
    }
}
var i = function() {
    console.log("init");
};
f();
f();
