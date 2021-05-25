(function iife(a, b, c) {
    console.log(a, b, c);
    if (a) iife(a - 1, b, c);
})(3, 4, 5);
