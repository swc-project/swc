///<AmD-moDulE nAme='NamedModule'/>
define("NamedModule", [
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
