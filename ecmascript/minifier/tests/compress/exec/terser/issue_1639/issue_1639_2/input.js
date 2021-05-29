var a = 100,
    b = 10;
function f19() {
    if ((++a, false)) if (a) if (++a);
}
f19();
console.log(a, b);
