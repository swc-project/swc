var a = 0;
function f() {
    return a++;
}
f() ? (a += 2) : (a += 4);
console.log(a);
