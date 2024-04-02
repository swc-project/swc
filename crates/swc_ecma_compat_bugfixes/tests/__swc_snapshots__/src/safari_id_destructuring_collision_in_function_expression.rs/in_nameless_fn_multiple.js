// nameless iife
var x = function() {
    // not transformed
    var b = function a(_a) {
        return _a;
    };
}();
// nameless iife
var x = function x() {
    var b = function a(_a) {
        return _a;
    };
}();
// nameless function
(function() {
    // not transformed
    var b = function a(_a1) {
        return _a1;
    };
});
// named function
(function x() {
    var b = function a(_a) {
        return _a;
    };
});
