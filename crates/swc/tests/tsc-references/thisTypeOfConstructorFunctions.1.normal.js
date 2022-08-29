//// [thisTypeOfConstructorFunctions.js]
/**
 * @class
 * @template T
 * @param {T} t
 */ function Cp(t) {
    var _this = this;
    /** @type {this} */ this.dit = this;
    this.y = t;
    /** @return {this} */ this.m3 = function() {
        return _this;
    };
}
Cp.prototype = {
    /** @return {this} */ m4: function m4() {
        this.z = this.y;
        return this;
    }
};
/**
 * @class
 * @template T
 * @param {T} t
 */ function Cpp(t) {
    this.y = t;
}
/** @return {this} */ Cpp.prototype.m2 = function() {
    this.z = this.y;
    return this;
};
var cp = new Cp(1);
var cpp = new Cpp(2);
cp.dit;
/** @type {Cpp<number>} */ var cppn = cpp.m2();
/** @type {Cp<number>} */ var cpn = cp.m3();
/** @type {Cp<number>} */ var cpn = cp.m4();
