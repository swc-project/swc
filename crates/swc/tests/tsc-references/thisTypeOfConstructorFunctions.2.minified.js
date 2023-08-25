//// [thisTypeOfConstructorFunctions.js]
/**
 * @class
 * @template T
 * @param {T} t
 */ function Cp(t) {
    var _this = this;
    /** @type {this} */ this.dit = this, this.y = t, /** @return {this} */ this.m3 = function() {
        return _this;
    };
}
/**
 * @class
 * @template T
 * @param {T} t
 */ function Cpp(t) {
    this.y = t;
}
Cp.prototype = {
    /** @return {this} */ m4: function() {
        return this.z = this.y, this;
    }
}, /** @return {this} */ Cpp.prototype.m2 = function() {
    return this.z = this.y, this;
};
var cp = new Cp(1), cpp = new Cpp(2);
cp.dit, cpp.m2(), cp.m3(), cp.m4();
