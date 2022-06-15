(function a(b, c, d) {
    console.log(b, c, d);
    if (b) a(b - 1, c, d);
})(3, 4, 5);
