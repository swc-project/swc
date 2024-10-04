//// [verbatimModuleSyntaxNoElisionCJS.ts]
"use strict";
//// [/a.ts]
"use strict";
module.exports = I;
//// [/b.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
const I = require("./a");
//// [/c.ts]
"use strict";
(function(I) {
    I.x = 1;
})(I || (I = {}));
var I;
module.exports = I;
//// [/d.ts]
"use strict";
const I = require("./c");
module.exports = J;
//// [/e.d.ts]
"use strict";
module.exports = I;
//// [/f.ts]
"use strict";
const I = {};
module.exports = I;
//// [/z.ts]
// test harness is weird if the last file includs a require >:(
"use strict";
