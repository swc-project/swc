//// [subtypingWithObjectMembersOptionality2.ts]
// Derived member is optional but base member is not, should be an error
// object literal case
var a;
var b;
var r = true ? a : b; // ok
