// A plain binding is not a pattern: dropping the unused binding and the
// annotated initializer never runs user code.
const a = /*#__PURE__*/ x();
log(b);
