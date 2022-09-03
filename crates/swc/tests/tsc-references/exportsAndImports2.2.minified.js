//// [exportsAndImports2.ts]
"use strict";
//// [t1.ts]
"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), _export(exports, {
    x: function() {
        return x;
    },
    y: function() {
        return y;
    }
});
var x = "x", y = "y";
//// [t2.ts]
"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), _export(exports, {
    y: function() {
        return _t1.x;
    },
    x: function() {
        return _t1.y;
    }
});
var _t1 = require("./t1");
//// [t3.ts]
"use strict";
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}
Object.defineProperty(exports, "__esModule", {
    value: !0
}), _export(exports, {
    y: function() {
        return _t1.x;
    },
    x: function() {
        return _t1.y;
    }
});
var _t1 = require("./t1");
