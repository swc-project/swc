function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
(function(A) {
    var A1 = function A1() {
        "use strict";
        _classCallCheck(this, A1);
    };
    A.A = A1;
    var AG1 = function AG1() {
        "use strict";
        _classCallCheck(this, AG1);
    };
    A.AG = AG1;
    var A2 = function A2() {
        "use strict";
        _classCallCheck(this, A2);
    };
    var AG2 = function AG2() {
        "use strict";
        _classCallCheck(this, AG2);
    };
})(A || (A = {
}));
// no errors expected, these are all exported
var a;
var a = new A.A();
var AG = new A.AG();
// errors expected, these are not exported
var a2 = new A.A2();
var ag2 = new A.A2();
