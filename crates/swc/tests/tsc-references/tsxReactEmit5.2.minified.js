//// [tsxReactEmit5.tsx]
"use strict";
//// [file.tsx]
"use strict";
//// [test.d.ts]
"use strict";
var React;
Object.defineProperty(exports, "__esModule", {
    value: !0
}), Object.defineProperty(exports, "React", {
    enumerable: !0,
    get: function() {
        return React;
    }
});
//// [react-consumer.tsx]
//! 
//!   x Expected '>', got 'x'
//!    ,----
//!  5 | var spread1 = <div x='' {...foo} y='' />;
//!    :                    ^
//!    `----
