//// [foo_0.ts]
define([
    "require",
    "./foo_1"
], function(require, _foo_1) {
    "use strict";
    var Foo;
    (function(Foo) {
        var x = Foo.x = _foo_1.x;
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
        var x = Foo.x = _foo_2.x;
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
        var x = Foo.x = _foo_0.x;
    })(Foo || (Foo = {}));
    return Foo;
});
