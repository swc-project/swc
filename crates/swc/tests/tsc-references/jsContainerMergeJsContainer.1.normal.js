//// [jsContainerMergeJsContainer.ts]
// #24131
//// [a.js]
var a = {};
a.d = function() {};
//// [b.js]
a.d.prototype = {};
