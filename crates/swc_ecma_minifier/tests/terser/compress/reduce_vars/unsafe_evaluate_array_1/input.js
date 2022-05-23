function f0() {
    var a = 1;
    var b = [];
    b[a] = 2;
    console.log(a + 3);
}
function f1() {
    var a = [1];
    a[2] = 3;
    console.log(a.length);
}
function f2() {
    var a = [1];
    a.push(2);
    console.log(a.length);
}
