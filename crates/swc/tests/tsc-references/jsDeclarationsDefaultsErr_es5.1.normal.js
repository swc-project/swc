function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Cls = function Cls() {
    "use strict";
    _classCallCheck(this, Cls);
    // @allowJs: true
    // @checkJs: true
    // @target: es5
    // @outDir: ./out
    // @declaration: true
    // @filename: index1.js
    // merge type alias and alias (should error, see #32367)
    this.x = 12;
};
Cls.y = "ok";
export default Cls;
var C = function C() {
    "use strict";
    _classCallCheck(this, C);
};
// @filename: index2.js
// merge type alias and class (error message improvement needed, see #32368)
/**
 * @typedef {string | number} default
 */ // @filename: index2.js
// merge type alias and class (error message improvement needed, see #32368)
export { C as default };
// @filename: index3.js
// merge type alias and variable (behavior is borked, see #32366)
/**
 * @typedef {string | number} default
 */ // @filename: index3.js
// merge type alias and variable (behavior is borked, see #32366)
var x = 12;
export { x as default }; /**
 * @typedef {string | number} default
 */ 
