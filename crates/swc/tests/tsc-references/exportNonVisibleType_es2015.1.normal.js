// @Filename: foo1.ts
var x = {
    a: "test",
    b: 42
};
module.exports = x; // Should fail, I1 not exported.
export { };
// @Filename: foo2.ts
class C1 {
}
module.exports = C1; // Should fail, type I1 of visible member C1.m1 not exported.
export { };
// @Filename: foo3.ts
class C1 {
}
module.exports = C1; // Should work, private type I1 of visible class C1 only used in private member m1.
export { };
