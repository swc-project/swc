"use strict";
var swcHelpers = require("@swc/helpers");
class A {
    foo() {
        var _this = this;
        return swcHelpers.asyncToGenerator(function*() {
            try {
                return yield (function() {
                    var _ref = swcHelpers.asyncToGenerator(function*(x) {
                        return x + _this.val;
                    });
                    return function(x) {
                        return _ref.apply(this, arguments);
                    };
                })()('a'); // this is undefined
            // return await Promise.all(['a', 'b'].map(async (x) => x + this.val)); // this is undefined
            } catch (e) {
                throw e;
            }
        })();
    }
    constructor(){
        this.val = '1';
    }
}
new A().foo();
