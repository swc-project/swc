let a = 0;
function g() {
    a = "123";
    console.log(a);
}
function f() {
    // a = "123";
    console.log(a);
}
console.log(((a += 1), (a += 2)));
