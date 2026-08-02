//// [exportsAndImports2.ts]
"use strict";
//// [t1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    get x () {
        return x;
    },
    get y () {
        return y;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
var x = "x", y = "y";
//// [t2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    get x () {
        return _t1.y;
    },
    get y () {
        return _t1.x;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
var _t1 = require("./t1");
//// [t3.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    get x () {
        return _t1.y;
    },
    get y () {
        return _t1.x;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: Object.getOwnPropertyDescriptor(all, name).get
});
var _t1 = require("./t1");
