//// [constructorFunctionMethodTypeParameters.js]
function Cls(t) {
    this.t = t;
}
Cls.prototype.topLevelComment = function(t, v) {
    return v;
}, Cls.prototype.nestedComment = function(t, u) {
    return t;
};
var c = new Cls('a');
c.topLevelComment('a', 'b'), c.nestedComment('a', 'b');
