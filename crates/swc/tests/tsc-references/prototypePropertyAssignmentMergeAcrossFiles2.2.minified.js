//// [prototypePropertyAssignmentMergeAcrossFiles2.js]
var Ns = {};
Ns.One = function() {}, Ns.Two = function() {}, Ns.One.prototype = {
    ok: function() {}
}, Ns.Two.prototype = {};
//// [other.js]
(void 0).wat, (void 0).wat;
