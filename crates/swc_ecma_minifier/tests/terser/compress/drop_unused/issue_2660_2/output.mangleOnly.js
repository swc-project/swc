var a = 1;
function b(c) {
    c && b();
    --a, a.toString();
}
b();
console.log(a);
