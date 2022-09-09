function s() {
    var s = this, o = options.success;
    return ((options.success = function(n, t, i) {
        i.wait && s.add(n, i), o && o(n, t, i);
    }), model.save(null, options), model);
}
