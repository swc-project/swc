define([
    "require"
], function(require) {
    "use strict";
    ///<amd-module name='NamedModule'/>
    class Foo {
        x;
        constructor(){
            this.x = 5;
        }
    }
    module.exports = Foo;
});
