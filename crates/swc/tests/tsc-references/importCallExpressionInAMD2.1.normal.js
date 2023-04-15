//// [0.ts]
define([
    "require",
    "exports"
], function(require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    Object.defineProperty(exports, "B", {
        enumerable: true,
        get: function() {
            return B;
        }
    });
    class B {
        print() {
            return "I am B";
        }
    }
});
//// [2.ts]
// We use Promise<any> for now as there is no way to specify shape of module object
define([
    "require",
    "exports",
    "@swc/helpers/_/_interop_require_wildcard"
], function(require, exports, _interop_require_wildcard) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function foo(x) {
        x.then((value)=>{
            let b = new value.B();
            b.print();
        });
    }
    foo(new Promise((resolve, reject)=>require([
            "./0"
        ], (m)=>resolve(/*#__PURE__*/ _interop_require_wildcard._(m)), reject)));
});
