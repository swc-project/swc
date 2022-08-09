(function f(i, n, o) {
    console.log(i, n, o);
    if (i) f(i - 1, n, o);
})(3, 4, 5);
