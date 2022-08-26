function n(n) {
    console.log(n);
}
function i() {
    return n;
}
function o() {
    if (t !== (t = i())) {
        t(1);
    } else {
        t(2);
    }
}
var t = function() {
    console.log("init");
};
o();
o();
