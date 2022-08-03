var n = 0;
!(function() {
    n++;
})(n++ + new (function() {
    this.a = 0;
    var r = (n = n + 1) + (n = 1 + n);
    return n++ + r;
})());
console.log(n);
