define("NamedModule", [
    "require"
], function(require) {
    "use strict";
    ///<amd-module name='NamedModule'/>
    class Foo {
        x: number;
        constructor(){
            this.x = 5;
        }
    }
    return Foo;
});
