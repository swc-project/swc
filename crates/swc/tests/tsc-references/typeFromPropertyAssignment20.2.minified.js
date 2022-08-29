//// [bluebird.js]
!function(f) {
    return f;
}(function() {
    (function() {
        this._trampolineEnabled = !0;
    }).prototype.disableTrampolineIfNecessary = function(b) {
        b && (this._trampolineEnabled = !1);
    };
});
