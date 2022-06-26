global._processChunk = function _processChunk(chunk, async, newReq) {
    if (chunk) {
        if (!async) {
            return true;
        }
        var newReq = this.write();
        newReq.callback = callback;
        return;
    }
    cb();
};
