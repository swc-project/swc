function a() {
    var a = this, b = options.success;
    return ((options.success = function(c, d, e) {
        e.wait && a.add(c, e), b && b(c, d, e);
    }), model.save(null, options), model);
}
