//// [foo_0.ts]
define([
    "require",
    "./foo_1"
], function(require, foo1) {
    "use strict";
    (function(Foo) {
        Foo.x = foo1.x;
    })(Foo || (Foo = {}));
    var Foo;
    return Foo;
});
//// [foo_1.ts]
define([
    "require",
    "./foo_2"
], function(require, foo2) {
    "use strict";
    (function(Foo) {
        Foo.x = foo2.x;
    })(Foo || (Foo = {}));
    var Foo;
    return Foo;
});
//// [foo_2.ts]
define([
    "require",
    "./foo_0"
], function(require, foo0) {
    "use strict";
    (function(Foo) {
        Foo.x = foo0.x;
    })(Foo || (Foo = {}));
    var Foo;
    return Foo;
});
