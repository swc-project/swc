define("SecondModuleName", [
    "require"
], function(require) {
    "use strict";
    ///<amd-module name='FirstModuleName'/>
    ///<amd-module name='SecondModuleName'/>
    class Foo {
        x: number;
        constructor(){
            this.x = 5;
        }
    }
    return Foo;
});
