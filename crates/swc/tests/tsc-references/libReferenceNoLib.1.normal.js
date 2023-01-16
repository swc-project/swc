//// [libReferenceNoLib.ts]
"use strict";
// Test that passing noLib disables <reference lib> resolution.
//// [fakelib.ts]
"use strict";
//// [file1.ts]
"use strict";
/// <reference lib="dom" />
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "elem", {
    enumerable: true,
    get: ()=>elem
});
const elem = {
    field: 'a'
};
