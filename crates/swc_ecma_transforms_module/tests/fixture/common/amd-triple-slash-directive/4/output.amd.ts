define("should-ignore", [
    "require"
], function(require) {
    "use strict";
    /*/<amd-module name='should-ignore'/> */ class Foo {
        x: number;
        constructor(){
            this.x = 5;
        }
    }
    return Foo;
});
