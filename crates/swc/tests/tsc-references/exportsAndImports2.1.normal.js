//// [exportsAndImports2.ts]
"use strict";
//// [t1.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    x: function() {
        return x;
    },
    y: function() {
        return y;
    }
});
var x = "x";
var y = "y";
//// [t2.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
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
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    y: function() {
        return _t1.x;
    },
    x: function() {
        return _t1.y;
    }
});
var _t1 = require("./t1");
