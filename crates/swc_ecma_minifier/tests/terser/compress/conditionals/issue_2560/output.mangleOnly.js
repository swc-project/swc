function a(a) {
    console.log(a);
}
function b() {
    return a;
}
function c() {
    if (d !== (d = b())) {
        d(1);
    } else {
        d(2);
    }
}
var d = function() {
    console.log("init");
};
c();
c();
