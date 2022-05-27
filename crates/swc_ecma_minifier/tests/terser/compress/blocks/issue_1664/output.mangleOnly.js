var a = 1;
function b() {
    if (b) a = 2;
    {
        function b() {}
        b();
    }
}
b();
console.log(a);
