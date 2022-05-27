function b(a) {
    console.log(a);
}
function c() {
    return b;
}
function a() {
    if (d !== (d = c())) {
        d(1);
    } else {
        d(2);
    }
}
var d = function() {
    console.log("init");
};
a();
a();
