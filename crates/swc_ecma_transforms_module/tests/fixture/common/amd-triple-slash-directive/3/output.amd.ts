define("NamedModule", [
    "require"
], function(require) {
    "use strict";
    ///<AmD-moDulE nAme='NamedModule'/>
    class Foo {
        x: number;
        constructor(){
            this.x = 5;
        }
    }
    return Foo;
});
