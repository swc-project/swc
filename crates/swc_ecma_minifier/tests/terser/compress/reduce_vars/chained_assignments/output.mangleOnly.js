function a() {
    var b = [
        94,
        173,
        190,
        239
    ];
    var a = 0;
    a |= b[0];
    a <<= 8;
    a |= b[1];
    a <<= 8;
    a |= b[2];
    a <<= 8;
    a |= b[3];
    return a;
}
console.log(a().toString(16));
