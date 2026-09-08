//// [verbatimModuleSyntaxNoElisionCJS.ts]
//// [/a.ts]
module.exports = I;
//// [/b.ts]
require("./a");
//// [/c.ts]
var I;
(I || (I = {})).x = 1, module.exports = I;
//// [/d.ts]
require("./c"), module.exports = J;
//// [/e.d.ts]
module.exports = I;
//// [/f.ts]
module.exports = {};
//// [/z.ts]
