let a = 0;
function f() {
    a = "123";
    console.log(a);
}

console.log(((a += 1), (a += 2)));
