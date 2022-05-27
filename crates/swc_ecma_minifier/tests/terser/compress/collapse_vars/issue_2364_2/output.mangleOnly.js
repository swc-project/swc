function a() {
    var b = compilation.validate;
    var c = b.apply(null, arguments);
    return (a.errors = b.errors), c;
}
