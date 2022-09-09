global._processChunk = function r(c, a, l) {
    if (c) {
        if (!a) {
            return true;
        }
        var l = this.write();
        l.callback = callback;
        return;
    }
    cb();
};
