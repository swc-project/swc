//// [mod.js]
// #24111 -- shouldn't assert
C.prototype = {}, C.prototype.bar.foo = {};
