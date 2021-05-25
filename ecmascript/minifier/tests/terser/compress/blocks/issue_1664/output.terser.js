var a = 1;
function f() {
    if (undefined) a = 2;
    {
        function undefined() {}
        undefined();
    }
}
f();
console.log(a);
