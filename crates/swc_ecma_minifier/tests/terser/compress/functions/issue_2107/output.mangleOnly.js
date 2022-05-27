var a = 0;
!(function() {
    a++;
})(a++ + new (function() {
    this.a = 0;
    var b = (a = a + 1) + (a = 1 + a);
    return a++ + b;
})());
console.log(a);
