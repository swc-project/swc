var a = 100,
    b = 10;
function f() {
    switch (1) {
        case 1:
            b = a++;
            return ++b;
        default:
            var b;
    }
}
f();
console.log(a, b);
