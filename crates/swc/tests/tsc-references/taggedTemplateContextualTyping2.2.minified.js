//// [taggedTemplateContextualTyping2.ts]
function tempTag2(...rest) {}
// If contextual typing takes place, these functions should work.
// Otherwise, the arrow functions' parameters will be typed as 'any',
// and it is an error to invoke an any-typed value with type arguments,
// so this test will error.
tempTag2`${(x)=>(x(void 0), x)}${0}`, tempTag2`${(x)=>(x(void 0), x)}${(y)=>(y(null), y)}${"hello"}`, tempTag2`${(x)=>(x(void 0), x)}${void 0}${"hello"}`;
