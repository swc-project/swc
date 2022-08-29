//// [foo_0.ts]
define([
    "require",
    "./foo_1"
], function(require, _foo1) {
    "use strict";
    var Foo;
    (function(Foo) {
        var x = Foo.x = _foo1.x;
    })(Foo || (Foo = {}));
    return Foo;
});
//// [foo_1.ts]
define([
    "require",
    "./foo_2"
], function(require, _foo2) {
    "use strict";
    var Foo;
    (function(Foo) {
        var x = Foo.x = _foo2.x;
    })(Foo || (Foo = {}));
    return Foo;
});
//// [foo_2.ts]
define([
    "require",
    "./foo_0"
], function(require, _foo0) {
    "use strict";
    var Foo;
    (function(Foo) {
        var x = Foo.x = _foo0.x;
    })(Foo || (Foo = {}));
    return Foo;
});
