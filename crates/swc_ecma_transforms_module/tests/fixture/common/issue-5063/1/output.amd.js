define([
    "require"
], function(require) {
    "use strict";
    class Foo {
        bar = 5;
        getThing(a, b = this.bar) {
            return a + b;
        }
    }
});
