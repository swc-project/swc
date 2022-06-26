function a(a, b) {
    (a.b = b), (b += 2);
    console.log(a.b, b);
}
a({}, 1);
