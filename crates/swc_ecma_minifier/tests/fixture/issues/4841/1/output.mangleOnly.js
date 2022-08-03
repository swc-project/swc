global._processChunk = function r(t, e, i) {
    if (t) {
        if (!e) {
            return true;
        }
        var i = this.write();
        i.callback = callback;
        return;
    }
    cb();
};
