var x = {
    a: "test",
    b: 42
};
class C1 {
}
class C1 {
}
module.exports = x;
// @Filename: foo1.ts
export { }; // Should work, private type I1 of visible class C1 only used in private member m1.
