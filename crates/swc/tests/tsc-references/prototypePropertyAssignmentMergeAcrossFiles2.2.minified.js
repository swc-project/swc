//// [prototypePropertyAssignmentMergeAcrossFiles2.js]
var Ns = {};
Ns.One = function() {}, Ns.Two = function() {}, Ns.One.prototype = {
    ok: function() {}
}, Ns.Two.prototype = {};
//// [other.js]
var two;
(void 0).wat, two.wat;
