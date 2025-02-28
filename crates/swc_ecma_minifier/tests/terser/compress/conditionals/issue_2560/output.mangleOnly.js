function o(n) {
    console.log(n);
}
function i() {
    return o;
}
function n() {
    if (c !== (c = i())) {
        c(1);
    } else {
        c(2);
    }
}
var c = function() {
    console.log("init");
};
n();
n();
