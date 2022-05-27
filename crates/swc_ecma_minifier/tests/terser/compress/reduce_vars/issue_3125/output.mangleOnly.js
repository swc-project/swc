var a;
console.log((function() {
    this.p++;
}.call((a = {
    p: 6
})), a.p));
