// Test cases for arrow function IIFE in sequence expressions (Issue #10859)

// Case 1: Simple arrow IIFE in sequence expression
console.log("start"), (() => { console.log("middle"); })(), console.log("end");

// Case 2: Arrow IIFE returning value in sequence
var x = (console.log("before"), (() => 42)(), console.log("after"));

// Case 3: Multiple arrow IIFEs in sequence
(() => { console.log("first"); })(), (() => { console.log("second"); })();

// Case 4: Arrow IIFE with parameters in sequence
var y = (console.log("setup"), ((param) => param + 1)(5), console.log("done"));

// Case 5: Arrow IIFE expression (not block) in sequence
var a = (console.log("expr"), (() => 42 + 8)(), console.log("result"));

// Case 6: Arrow IIFE with simple expression body
var b = (1, (() => 2 + 3)(), 4);

// Case 7: Arrow IIFE with single parameter
var c = (0, ((x) => x * 2)(10), 1);