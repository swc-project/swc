var a = 2;
function b(c) {
    return (c && b()) || a--;
}
b(1);
console.log(a);
