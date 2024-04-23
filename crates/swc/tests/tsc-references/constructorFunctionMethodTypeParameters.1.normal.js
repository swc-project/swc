//// [constructorFunctionMethodTypeParameters.js]
/**
 * @template {string} T
 * @param {T} t
 */ function Cls(t) {
    this.t = t;
}
/**
 * @template {string} V
 * @param {T} t
 * @param {V} v
 * @return {V}
 */ Cls.prototype.topLevelComment = function(t, v) {
    return v;
};
Cls.prototype.nestedComment = /**
     * @template {string} U
     * @param {T} t
     * @param {U} u
     * @return {T}
     */ function(t, u) {
    return t;
};
var c = new Cls('a');
var s = c.topLevelComment('a', 'b');
var t = c.nestedComment('a', 'b');
