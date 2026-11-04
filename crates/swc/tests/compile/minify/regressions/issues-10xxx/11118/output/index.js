function xxx() {
    var b = [].concat(Array.prototype.slice.call(arguments));
    var c = [].concat([
        2
    ], Array.prototype.slice.call(arguments));
    return b.length + c.length;
}
