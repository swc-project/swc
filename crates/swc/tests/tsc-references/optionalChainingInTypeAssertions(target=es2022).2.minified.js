//// [optionalChainingInTypeAssertions.ts]
const foo = new class {
    m() {}
}();
foo.m?.(), foo.m?.(), /*a1*/ /*a2*/ foo.m?.(), /*b1*/ foo.m /*b3*/ ?.(), // https://github.com/microsoft/TypeScript/issues/50148
foo?.m.length, foo?.m.length, foo?.m.length, foo?.m.length;
