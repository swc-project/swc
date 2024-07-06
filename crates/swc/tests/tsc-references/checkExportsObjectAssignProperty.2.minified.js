//// [mod1.js]
Object.defineProperty(exports, "thing", {
    value: 42,
    writable: !0
}), Object.defineProperty(exports, "readonlyProp", {
    value: "Smith",
    writable: !1
}), Object.defineProperty(exports, "rwAccessors", {
    get: function() {
        return 98122;
    },
    set: function(_) {}
}), Object.defineProperty(exports, "readonlyAccessor", {
    get: function() {
        return 21.75;
    }
}), Object.defineProperty(exports, "setonlyAccessor", {
    set: function(str) {
        this.rwAccessors = Number(str);
    }
});
//// [mod2.js]
Object.defineProperty(module.exports, "thing", {
    value: "yes",
    writable: !0
}), Object.defineProperty(module.exports, "readonlyProp", {
    value: "Smith",
    writable: !1
}), Object.defineProperty(module.exports, "rwAccessors", {
    get: function() {
        return 98122;
    },
    set: function(_) {}
}), Object.defineProperty(module.exports, "readonlyAccessor", {
    get: function() {
        return 21.75;
    }
}), Object.defineProperty(module.exports, "setonlyAccessor", {
    set: function(str) {
        this.rwAccessors = Number(str);
    }
});
//// [index.js]
require("./mod1").thing, require("./mod2").thing;
//// [validator.ts]
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!    ,-[3:1]
//!  1 | import "./";
//!  2 | 
//!  3 | import m1 = require("./mod1");
//!    : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  4 | 
//!  5 | m1.thing;
//!  6 | m1.readonlyProp;
//!    `----
//!   x Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead.
//!     ,-[23:1]
//!  20 | m1.rwAccessors = "no";
//!  21 | m1.setonlyAccessor = 0;
//!  22 | 
//!  23 | import m2 = require("./mod2");
//!     : ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//!  24 | 
//!  25 | m2.thing;
//!  26 | m2.readonlyProp;
//!     `----
