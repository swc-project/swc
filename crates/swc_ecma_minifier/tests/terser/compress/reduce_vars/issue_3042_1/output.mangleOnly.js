function o() {}
var n = [
    1,
    2
].map(function() {
    return new o();
});
console.log(n[0].constructor === n[1].constructor);
