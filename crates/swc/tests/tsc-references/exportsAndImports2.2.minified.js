//// [exportsAndImports2.ts]
//// [t1.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    x: function() {
        return x;
    },
    y: function() {
        return y;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: all[name]
});
var x = "x", y = "y";
//// [t2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    x: function() {
        return _t1.y;
    },
    y: function() {
        return _t1.x;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: all[name]
});
var _t1 = require("./t1");
//// [t3.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
});
var target = exports, all = {
    x: function() {
        return _t1.y;
    },
    y: function() {
        return _t1.x;
    }
};
for(var name in all)Object.defineProperty(target, name, {
    enumerable: !0,
    get: all[name]
});
var _t1 = require("./t1");
