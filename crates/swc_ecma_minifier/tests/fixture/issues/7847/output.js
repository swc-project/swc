function requireState() {
    return hasRequiredState ? state : (hasRequiredState = 1, state = {
        getHighWaterMark: function(o) {
            return o.objectMode ? 16 : 16384;
        }
    });
}
if (g()) {
    var state, hasRequiredState;
    const a = requireState();
    console.log(a.getHighWaterMark());
    const b = requireState();
    console.log(b.getHighWaterMark());
}
