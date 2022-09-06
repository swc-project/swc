//// [optionalChainingInTypeAssertions.ts]
class Foo {
    m() {}
}
const foo = new Foo();
foo.m?.();
foo.m?.();
/*a2*/ /*a1*/ foo.m?.();
foo.m /*b3*/ ?.();
// https://github.com/microsoft/TypeScript/issues/50148
foo?.m.length;
foo?.m.length;
foo?.["m"].length;
foo?.["m"].length;
