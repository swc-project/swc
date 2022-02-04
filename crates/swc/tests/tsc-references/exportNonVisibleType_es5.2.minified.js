function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
module.exports = {
    a: "test",
    b: 42
};
var C1 = function() {
    "use strict";
    _classCallCheck(this, C1);
};
module.exports = C1;
var C1 = function() {
    "use strict";
    _classCallCheck(this, C1);
};
module.exports = C1 // Should work, private type I1 of visible class C1 only used in private member m1.
;
export { };
