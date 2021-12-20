function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
// @allowJs: true
// @checkJs: true
// @target: es5
// @outDir: ./out
// @declaration: true
// @filename: source.js
export var Thing = function Thing() {
    "use strict";
    _classCallCheck(this, Thing);
};
export var OtherThing = function OtherThing() {
    "use strict";
    _classCallCheck(this, OtherThing);
};
// @filename: index.js
export { Thing, OtherThing as default } from "./source";
