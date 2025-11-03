// Basic constant folding for Math.ceil()
var a = Math.ceil(3.2);
var b = Math.ceil(-3.2);
var c = Math.ceil(0);
var d = Math.ceil(5);

// Basic constant folding for Math.floor()
var e = Math.floor(3.8);
var f = Math.floor(-3.2);
var g = Math.floor(0);
var h = Math.floor(5);

// Basic constant folding for Math.round()
var i = Math.round(3.5);
var j = Math.round(-3.5);
var k = Math.round(3.4);
var l = Math.round(-3.6);
var m = Math.round(0);

// Basic constant folding for Math.sqrt()
var n = Math.sqrt(16);
var o = Math.sqrt(0);
var p = Math.sqrt(2);
var q = Math.sqrt(9);

// Non-constant expressions should not be optimized
var x = 5;
var notOptimized1 = Math.ceil(x);
var notOptimized2 = Math.floor(x + 1);
var notOptimized3 = Math.round(x * 2);
var notOptimized4 = Math.sqrt(x);

// Chained optimization example
var result = Math.ceil(3.2);
if (result === 4) {
    console.log("Optimized correctly");
}

// Nested Math calls should be optimized
var nested = Math.ceil(Math.sqrt(16));

// Math operations with constants
var expr1 = Math.ceil(1.5) + Math.floor(2.9);
var expr2 = Math.round(3.7) - Math.sqrt(4);
