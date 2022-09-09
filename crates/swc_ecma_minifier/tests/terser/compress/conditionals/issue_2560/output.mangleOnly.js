function n(n) {
    console.log(n);
}
function o() {
    return n;
}
function i() {
    if (c !== (c = o())) {
        c(1);
    } else {
        c(2);
    }
}
var c = function () {
    console.log("init");
};
i();
i();
