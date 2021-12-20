function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
var x, Cls = function() {
    "use strict";
    _classCallCheck(this, Cls), this.x = 12;
};
Cls.y = "ok";
export default Cls;
var C = function() {
    "use strict";
    _classCallCheck(this, C);
};
export { C as default };
export { x as default }; /**
 * @typedef {string | number} default
 */ 
