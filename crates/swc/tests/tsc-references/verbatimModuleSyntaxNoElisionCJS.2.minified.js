//// [verbatimModuleSyntaxNoElisionCJS.ts]
"use strict";
//// [/a.ts]
"use strict";
module.exports = I;
//// [/b.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
}), require("./a");
//// [/c.ts]
"use strict";
var I;
(I || (I = {})).x = 1, module.exports = I;
//// [/d.ts]
"use strict";
require("./c"), module.exports = J;
//// [/e.d.ts]
"use strict";
module.exports = I;
//// [/f.ts]
"use strict";
module.exports = {};
//// [/z.ts]
"use strict";
