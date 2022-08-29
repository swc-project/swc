//// [bluebird.js]
!function outer(f) {
    return f;
}(function inner() {
    var Async = function Async() {
        this._trampolineEnabled = true;
    };
    Async.prototype.disableTrampolineIfNecessary = function dtin(b) {
        if (b) {
            this._trampolineEnabled = false;
        }
    };
});
