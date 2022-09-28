function n() {}
var o = [
    1,
    2
].map(function() {
    return new n();
});
console.log(o[0].constructor === o[1].constructor);
