var v = null !== v ? v : function(e) {
    throw e;
}(new TypeError("Cannot destructure undefined"));
