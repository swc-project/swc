//// [tsxReactEmit5.tsx]
"use strict";
//// [file.tsx]
"use strict";
//// [test.d.ts]
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "React", {
    enumerable: true,
    get: function() {
        return React;
    }
});
var React;
//// [react-consumer.tsx]
//! 
//!   x Expected '>', got 'x'
//!    ,----
//!  5 | var spread1 = <div x='' {...foo} y='' />;
//!    :                    ^
//!    `----
