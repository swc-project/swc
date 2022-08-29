//// [prototypePropertyAssignmentMergeAcrossFiles2.js]
var Ns = {};
Ns.One = function() {};
Ns.Two = function() {};
Ns.One.prototype = {
    ok: function ok() {}
};
Ns.Two.prototype = {};
//// [other.js]
/**
 * @type {Ns.One}
 */ var one;
one.wat;
/**
 * @type {Ns.Two}
 */ var two;
two.wat;
