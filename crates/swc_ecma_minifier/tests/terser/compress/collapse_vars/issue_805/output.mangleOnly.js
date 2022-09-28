function o() {
    function o() {}
    o.prototype = {};
    o.prototype.bar = 42;
    return o;
}
console.log(new (o())().bar);
