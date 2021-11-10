function f() {
    var a = [94, 173, 190, 239];
    var b = 0;
    b |= a[0];
    b <<= 8;
    b |= a[1];
    b <<= 8;
    b |= a[2];
    b <<= 8;
    b |= a[3];
    return b;
}
console.log(f().toString(16));
