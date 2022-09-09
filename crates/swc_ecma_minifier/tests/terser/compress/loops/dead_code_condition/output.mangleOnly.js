for (var o = 0, n = 5; ((o += 1), 3) - 3 && n > 0; n--) {
    var r = (function () {
        n--;
    })(o++);
}
console.log(o);
