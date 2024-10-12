let a;
function g() {
    a = "123";
    console.log(a);
}
function f() {
    // a = "123";
    console.log(a);
}
f(), g();
console.log(((a += 1), (a += 2)));
