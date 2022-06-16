function a() {}
var b = [
    1,
    2
].map(function() {
    return new a();
});
console.log(b[0].constructor === b[1].constructor);
