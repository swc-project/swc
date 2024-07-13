define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    class SomeClass {
        constructor(properties){
            this.props = properties;
        }
        call() {
            const { myFunction } = this.props;
            if (myFunction) {
                myFunction();
            } else {
                console.log("DID NOT WORK!");
            }
        }
    }
    let instance = new SomeClass({
        myFunction: ()=>{
            console.log("CORRECT FUNCTION CALLED");
        }
    });
    instance.call();
});
