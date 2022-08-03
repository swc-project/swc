var n = 1;
function f() {
    if (f) n = 2;
    {
        function f() {}
        f();
    }
}
f();
console.log(n);
