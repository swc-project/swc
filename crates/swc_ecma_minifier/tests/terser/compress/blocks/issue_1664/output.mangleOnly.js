var n = 1;
function o() {
    if (o) n = 2;
    {
        function o() {}
        o();
    }
}
o();
console.log(n);
