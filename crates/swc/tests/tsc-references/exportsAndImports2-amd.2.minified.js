//// [exportsAndImports2-amd.ts]
define([
    "require"
], function(require) {});
//// [t1.ts]
define([
    "require",
    "exports"
], function(require, exports) {
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
});
//// [t2.ts]
define([
    "require",
    "exports",
    "./t1"
], function(require, exports, _t1) {
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
});
//// [t3.ts]
define([
    "require",
    "exports",
    "./t1"
], function(require, exports, _t1) {
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
});
