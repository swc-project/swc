//// [subtypingWithObjectMembersOptionality4.ts]
// Base has required property, derived adds an optional property, no errors
// object literal case
var a;
var b;
var r = true ? a : b; // ok
