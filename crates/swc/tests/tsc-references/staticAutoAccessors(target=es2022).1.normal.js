//// [staticAutoAccessors.ts]
// https://github.com/microsoft/TypeScript/issues/53752
class A {
    static accessor x = 1;
    accessor y = 2;
}
