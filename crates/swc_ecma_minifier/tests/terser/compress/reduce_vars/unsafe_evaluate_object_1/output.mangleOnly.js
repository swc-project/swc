function a() {
    var a = 1;
    var b = {};
    b[a] = 2;
    console.log(a + 3);
}
function b() {
    var a = {
        b: 1
    };
    a.b = 2;
    console.log(a.b + 3);
}
