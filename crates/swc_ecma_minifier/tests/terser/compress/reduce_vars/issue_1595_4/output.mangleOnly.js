(function d(a, b, c) {
    console.log(a, b, c);
    if (a) d(a - 1, b, c);
})(3, 4, 5);
