for (var a = 0, b = 5; ((a += 1), 3) - 3 && b > 0; b--) {
    var c = (function () {
        b--;
    })(a++);
}
console.log(a);
