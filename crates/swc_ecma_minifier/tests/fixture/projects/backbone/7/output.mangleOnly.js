function s() {
    var s = this, c = options.success;
    return ((options.success = function(n, u, t) {
        t.wait && s.add(n, t), c && c(n, u, t);
    }), model.save(null, options), model);
}
