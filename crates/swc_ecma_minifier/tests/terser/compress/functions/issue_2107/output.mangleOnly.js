var n = 0;
!(function () {
    n++;
})(
    n++ +
        new (function () {
            this.a = 0;
            var o = (n = n + 1) + (n = 1 + n);
            return n++ + o;
        })()
);
console.log(n);
