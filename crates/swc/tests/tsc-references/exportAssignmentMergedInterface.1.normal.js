//// [foo_0.ts]
define([
    "require"
], function(require) {
    "use strict";
    return Foo;
});
//// [foo_1.ts]
define([
    "require"
], function(require) {
    "use strict";
    var x;
    x("test");
    x(42);
    var y = x.b;
    if (!!x.c) {}
    var z = {
        x: 1,
        y: 2
    };
    z = x.d;
});
