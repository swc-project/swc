//// [optionalChainingInTypeAssertions.ts]
var ref, ref1, ref2, ref3;
const foo = new class {
    m() {}
}();
null === (ref = foo.m) || void 0 === ref || ref.call(foo), null === (ref1 = foo.m) || void 0 === ref1 || ref1.call(foo), null === (ref2 = foo.m) || void 0 === ref2 || ref2.call(foo), null === (ref3 = foo.m) || void 0 === ref3 || ref3.call(foo), null == foo || foo.m.length, null == foo || foo.m.length, null == foo || foo.m.length, null == foo || foo.m.length;
