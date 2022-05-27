function a() {
    function a() {}
    a.prototype = {};
    a.prototype.bar = 42;
    return a;
}
console.log(new (a())().bar);
