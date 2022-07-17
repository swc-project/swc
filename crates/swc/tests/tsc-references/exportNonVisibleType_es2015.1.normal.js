// @Filename: foo1.ts
var x = {
    a: "test",
    b: 42
};
class C1 {
}
class C1 {
}
module.exports = x; // Should fail, I1 not exported.
export { }; // Should work, private type I1 of visible class C1 only used in private member m1.
