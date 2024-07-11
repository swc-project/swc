///<amd-module name='FirstModuleName'/>
///<amd-module name='SecondModuleName'/>
define("SecondModuleName", [
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    class Foo {
        x;
        constructor(){
            this.x = 5;
        }
    }
    module.exports = Foo;
});
