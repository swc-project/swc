var a = 100, b = 10;
function f19() {
    ++a, 0 && a && ++a;
}
f19(), console.log(a, b);
