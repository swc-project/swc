function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
var Base = function Base() {
    "use strict";
    _classCallCheck(this, Base);
};
var BaseFactory = function() {
    return new Base();
};
BaseFactory.Base = Base;
module.exports = BaseFactory;
// @filename: file.js
/** @typedef {typeof import('./base')} BaseFactory */ /**
 *
 * @param {InstanceType<BaseFactory["Base"]>} base
 * @returns {InstanceType<BaseFactory["Base"]>}
 */ var test = function(base) {
    return base;
};
