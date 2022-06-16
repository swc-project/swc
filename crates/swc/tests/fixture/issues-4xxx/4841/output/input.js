global._processChunk = function a(b, c, d) {
    if (b) {
        if (!c) {
            return true;
        }
        var d = this.write();
        return (d.callback = callback), void 0;
    }
    cb();
};
