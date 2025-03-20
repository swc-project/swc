//// [importsImplicitlyReadonly.ts]
//// [a.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    x: function() {
        return x;
    },
    y: function() {
        return y;
    }
});
var x = 1, y = 1;
//// [b.ts]
//!   x cannot reassign to an imported binding
//!    ,-[1:1]
//!  1 | import { x, y } from "./a";
//!    :          |
//!    :          `-- imported binding
//!  2 | import * as a1 from "./a";
//!  3 | import a2 = require("./a");
//!  4 | const a3 = a1;
//!  5 | 
//!  6 | x = 1;     // Error
//!    : ^
//!  7 | y = 1;     // Error
//!  8 | a1.x = 1;  // Error
//!  9 | a1.y = 1;  // Error
//!    `----
//!   x cannot reassign to an imported binding
//!     ,-[1:1]
//!   1 | import { x, y } from "./a";
//!     :             |
//!     :             `-- imported binding
//!   2 | import * as a1 from "./a";
//!   3 | import a2 = require("./a");
//!   4 | const a3 = a1;
//!   5 | 
//!   6 | x = 1;     // Error
//!   7 | y = 1;     // Error
//!     : ^
//!   8 | a1.x = 1;  // Error
//!   9 | a1.y = 1;  // Error
//!  10 | a2.x = 1;
//!     `----
