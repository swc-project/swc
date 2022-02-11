var E, F, Others;
(function(E) {
    E[E.A = 0] = "A";
})(E || (E = {})), (function(F) {
    F[F.B = 0] = "B";
})(F || (F = {})), E.A, F.B, (function(Others) {
    var C = function() {
        "use strict";
        !function(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }(this, C);
    };
})(Others || (Others = {}));
