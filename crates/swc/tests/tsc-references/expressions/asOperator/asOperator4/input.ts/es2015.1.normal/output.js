function foo1() {
}
//@module: commonjs
//@filename: foo.ts
export { foo1 as foo };
foo;
foo1;
