var a = 0;
function b() {
    return a++;
}
b() ? (a += 2) : (a += 4);
console.log(a);
