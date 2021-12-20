function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @filename: exportConsts.ts
// @strict: true
export { x };
export { x as xx };
export default x;
var x = 'x';
export { Y as Z };
var Y = function Y() {
    "use strict";
    _classCallCheck(this, Y);
};
// @filename: exportVars.ts
// @strict: true
export { y };
export { y as yy };
export default y;
var y = 'y';
