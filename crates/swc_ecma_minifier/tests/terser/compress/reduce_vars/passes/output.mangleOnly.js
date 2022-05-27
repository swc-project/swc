function a() {
    var c = 1, a = 2, b = 3;
    if (c) {
        a = b;
    } else {
        b = a;
    }
    console.log(c + a);
    console.log(a + b);
    console.log(c + b);
    console.log(c + a + b);
}
