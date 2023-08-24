//// [taggedTemplateContextualTyping1.ts]
function tempTag1(...rest) {}
// If contextual typing takes place, these functions should work.
// Otherwise, the arrow functions' parameters will be typed as 'any',
// and it is an error to invoke an any-typed value with type arguments,
// so this test will error.
tempTag1`${(x)=>(x(void 0), x)}${10}`, tempTag1`${(x)=>(x(void 0), x)}${(y)=>(y(void 0), y)}${10}`, tempTag1`${(x)=>(x(void 0), x)}${(y)=>(y(void 0), y)}${void 0}`, tempTag1`${(x)=>(x(void 0), x)}${(y)=>(y(void 0), y)}${void 0}`;
