function Cp(t) {
    this.dit = this, this.y = t, this.m3 = ()=>this;
}
function Cpp(t) {
    this.y = t;
}
Cp.prototype = {
    m4 () {
        return this.z = this.y, this;
    }
}, Cpp.prototype.m2 = function() {
    return this.z = this.y, this;
};
var cp = new Cp(1), cpp = new Cpp(2);
cp.dit, cpp.m2(), cp.m3(), cp.m4();
