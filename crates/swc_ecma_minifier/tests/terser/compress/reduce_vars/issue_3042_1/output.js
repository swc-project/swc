function f() {}
var a = [
    1,
    2
].map(function() {
    return new f();
});
console.log(a[0].constructor === a[1].constructor);
