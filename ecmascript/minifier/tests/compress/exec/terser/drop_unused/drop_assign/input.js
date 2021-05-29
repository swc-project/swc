function f1() {
    var a;
    a = 1;
}
function f2() {
    var a = 1;
    a = 2;
}
function f3(a) {
    a = 1;
}
function f4() {
    var a;
    return (a = 1);
}
function f5() {
    var a;
    return function () {
        a = 1;
    };
}

console.log(f1())
console.log(f2())
console.log(f3())
console.log(f4())
console.log(f5())
