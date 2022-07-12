///<amd-module name='FirstModuleName'/>
///<amd-module name='SecondModuleName'/>
define("SecondModuleName", [
    "require"
], function(require) {
    "use strict";
    class Foo {
        x: number;
        constructor(){
            this.x = 5;
        }
    }
    return Foo;
});
