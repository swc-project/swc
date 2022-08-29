//// [thisTypeOfConstructorFunctions.js]
function Cp(t) {
    var _this = this;
    this.dit = this, this.y = t, this.m3 = function() {
        return _this;
    };
}
function Cpp(t) {
    this.y = t;
}
Cp.prototype = {
    m4: function() {
        return this.z = this.y, this;
    }
}, Cpp.prototype.m2 = function() {
    return this.z = this.y, this;
};
var cp = new Cp(1), cpp = new Cpp(2);
cp.dit, cpp.m2(), cp.m3(), cp.m4();
