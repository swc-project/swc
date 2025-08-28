//// [optionalChainingInTypeAssertions.ts]
let foo = new class {
    m() {}
}();
foo.m?.(), foo.m?.(), foo.m?.(), foo.m?.(), (foo?.m).length, (foo?.m).length, (foo?.m).length, (foo?.m).length;
