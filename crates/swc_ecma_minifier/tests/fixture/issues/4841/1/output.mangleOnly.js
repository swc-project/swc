global._processChunk = function d(b, c, a) {
    if (b) {
        if (!c) {
            return true;
        }
        var a = this.write();
        a.callback = callback;
        return;
    }
    cb();
};
