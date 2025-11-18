/*/<amd-module name='should-ignore'/> */ define([
    "require"
], function(require) {
    "use strict";
    class Foo {
        x;
        constructor(){
            this.x = 5;
        }
    }
    module.exports = Foo;
});
