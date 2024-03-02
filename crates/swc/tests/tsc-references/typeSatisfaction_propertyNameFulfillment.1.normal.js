//// [typeSatisfaction_propertyNameFulfillment.ts]
var p = {
    a: 0,
    b: "hello",
    x: 8 // Should error, 'x' isn't in 'Keys'
};
// Should be OK -- retain info that a is number and b is string
var a = p.a.toFixed();
var b = p.b.substring(1);
// Should error even though 'd' is in 'Keys'
var d = p.d;
