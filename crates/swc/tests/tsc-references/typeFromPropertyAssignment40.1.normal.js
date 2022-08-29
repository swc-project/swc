//// [typeFromPropertyAssignment40.js]
function Outer() {
    var self = this;
    self.y = 2;
}
/** @type {Outer} */ var ok;
ok.y;
