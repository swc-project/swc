//// [foo_0.ts]
define([
    "require",
    "./foo_1"
], function(require, _foo_1) {
    "use strict";
    var Foo;
    (function(Foo) {
        var x = _foo_1.x;
        Object.defineProperty(Foo, "x", {
            enumerable: true,
            get: function get() {
                return x;
            },
            set: function set(v) {
                x = v;
            }
        });
    })(Foo || (Foo = {}));
    return Foo;
});
//// [foo_1.ts]
define([
    "require",
    "./foo_2"
], function(require, _foo_2) {
    "use strict";
    var Foo;
    (function(Foo) {
        var x = _foo_2.x;
        Object.defineProperty(Foo, "x", {
            enumerable: true,
            get: function get() {
                return x;
            },
            set: function set(v) {
                x = v;
            }
        });
    })(Foo || (Foo = {}));
    return Foo;
});
//// [foo_2.ts]
define([
    "require",
    "./foo_0"
], function(require, _foo_0) {
    "use strict";
    var Foo;
    (function(Foo) {
        var x = _foo_0.x;
        Object.defineProperty(Foo, "x", {
            enumerable: true,
            get: function get() {
                return x;
            },
            set: function set(v) {
                x = v;
            }
        });
    })(Foo || (Foo = {}));
    return Foo;
});
