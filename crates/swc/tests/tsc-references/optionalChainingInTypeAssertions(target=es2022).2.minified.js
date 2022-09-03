//// [optionalChainingInTypeAssertions.ts]
class Foo {
    m() {}
}
const foo = new Foo();
foo.m?.(), foo.m?.(), foo.m?.(), foo.m?.(), foo?.m.length, foo?.m.length, foo?.m.length, foo?.m.length;
