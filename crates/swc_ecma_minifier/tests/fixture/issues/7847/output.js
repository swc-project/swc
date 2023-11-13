function requireState() {
    return hasRequiredState ? state : (hasRequiredState = 1, state = {
        getHighWaterMark: function(o) {
            return o.objectMode ? 16 : 16384;
        }
    });
}
if (g()) {
    var state, hasRequiredState;
    console.log(requireState().getHighWaterMark()), console.log(requireState().getHighWaterMark());
}
