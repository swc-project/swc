function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
export var Thing = function() {
    "use strict";
    _classCallCheck(this, Thing);
};
export var OtherThing = function() {
    "use strict";
    _classCallCheck(this, OtherThing);
};
export { Thing, OtherThing as default } from "./source";
