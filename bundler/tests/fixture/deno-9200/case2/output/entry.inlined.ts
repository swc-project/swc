function foo1() {
}
export { foo1 as foo };
const mod = {
    foo: foo1
};
export { mod as lib };
