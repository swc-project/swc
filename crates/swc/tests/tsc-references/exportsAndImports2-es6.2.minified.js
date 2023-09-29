//// [exportsAndImports2-es6.ts]
//// [t1.ts]
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
var x = "x", y = "y";
//// [t2.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    x: function() {
        return _t1.y;
    },
    y: function() {
        return _t1.x;
    }
});
const _t1 = require("./t1");
//// [t3.ts]
Object.defineProperty(exports, "__esModule", {
    value: !0
}), function(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: !0,
        get: all[name]
    });
}(exports, {
    x: function() {
        return _t1.y;
    },
    y: function() {
        return _t1.x;
    }
});
const _t1 = require("./t1");
