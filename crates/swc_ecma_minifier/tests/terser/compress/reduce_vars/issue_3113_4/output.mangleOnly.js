var a = 0, c = 0;
function b() {
    c += a;
}
b(b(), ++a);
console.log(a, c);
