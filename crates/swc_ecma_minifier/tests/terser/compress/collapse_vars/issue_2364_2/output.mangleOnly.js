function r() {
    var a = compilation.validate;
    var e = a.apply(null, arguments);
    return (r.errors = a.errors), e;
}
