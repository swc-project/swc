// The annotation only describes the call `x()`; the pattern still reads
// property `a`, which can invoke a getter.
const {
    a,
} = /*#__PURE__*/ x();
log(b);
