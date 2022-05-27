function a() {
    var a = this, b = options.success;
    return ((options.success = function(d, e, c) {
        c.wait && a.add(d, c), b && b(d, e, c);
    }), model.save(null, options), model);
}
