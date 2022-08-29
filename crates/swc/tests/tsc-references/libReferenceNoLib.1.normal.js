//// [libReferenceNoLib.ts]
// Test that passing noLib disables <reference lib> resolution.
"use strict";
//// [fakelib.ts]
"use strict";
//// [file1.ts]
/// <reference lib="dom" />
"use strict";
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
