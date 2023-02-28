//// [nonPrimitiveAndEmptyObject.ts]
// Repro from #49480
var _foo_fooProps = foo.fooProps, fooProps = _foo_fooProps === void 0 ? {} : _foo_fooProps;
fooProps.barProp;
export { };
