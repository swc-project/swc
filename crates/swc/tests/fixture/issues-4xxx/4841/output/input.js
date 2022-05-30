global._processChunk = function d(b, c, a) {
    if (b) {
        if (!c) {
            return true;
        }
        var a = this.write();
        return (a.callback = callback), void 0;
    }
    cb();
};
