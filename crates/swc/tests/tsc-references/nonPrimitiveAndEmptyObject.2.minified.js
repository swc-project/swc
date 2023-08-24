//// [nonPrimitiveAndEmptyObject.ts]
// Repro from #49480
var _foo_fooProps = foo.fooProps;
(void 0 === _foo_fooProps ? {} : _foo_fooProps).barProp;
export { };
