console.log(function() {
    var a = 1, b = 2, c = 3;
    var a = c++, b = b /= a;
    return a + b;
}());
