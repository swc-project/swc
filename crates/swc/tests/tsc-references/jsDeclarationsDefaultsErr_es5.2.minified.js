function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var Cls = function() {
    "use strict";
    _classCallCheck(this, Cls), this.x = 12;
};
Cls.y = "ok";
export default Cls;
var C = function() {
    "use strict";
    _classCallCheck(this, C);
};
var x = 12;
export { C as default, x as default };
