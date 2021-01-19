function f(a, b) {
    (a.b = b), (b += 2);
    console.log(a.b, b);
}
f({}, 1);
