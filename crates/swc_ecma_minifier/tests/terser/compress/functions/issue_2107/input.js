var c = 0;
!(function () {
    c++;
})(
    c++ +
        new (function () {
            this.a = 0;
            var a = (c = c + 1) + (c = 1 + c);
            return c++ + a;
        })()
);
console.log(c);
