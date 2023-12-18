var n = 1;
function o() {
    if (n) n = 2;
    {
        function n() {}
        n();
    }
}
o();
console.log(n);
