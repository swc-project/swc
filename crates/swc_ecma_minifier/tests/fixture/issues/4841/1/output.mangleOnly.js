global._processChunk = function a(b, c, d) {
    if (b) {
        if (!c) {
            return true;
        }
        var d = this.write();
        d.callback = callback;
        return;
    }
    cb();
};
