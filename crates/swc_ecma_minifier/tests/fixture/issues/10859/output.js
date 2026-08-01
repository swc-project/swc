// Test cases for arrow function IIFE in sequence expressions (Issue #10859)
// Case 1: Simple arrow IIFE in sequence expression
console.log("start"), console.log("middle"), console.log("end");
// Case 2: Arrow IIFE returning value in sequence
var x = (console.log("before"), console.log("after"));
console.log("first"), console.log("second");
// Case 4: Arrow IIFE with parameters in sequence
var y = (console.log("setup"), console.log("done")), a = (console.log("expr"), console.log("result")), b = 4, c = 1;
