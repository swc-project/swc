let a;
function f() {
    a = "123";
    console.log(a);
}

f();
console.log(((a += 1), (a += 2)));
