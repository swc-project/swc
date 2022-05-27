function a(b, a) {
    (b.b = a), (a += 2);
    console.log(b.b, a);
}
a({}, 1);
