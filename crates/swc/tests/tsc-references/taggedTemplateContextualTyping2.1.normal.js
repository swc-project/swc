//// [taggedTemplateContextualTyping2.ts]
function tempTag2(...rest) {
    return undefined;
}
// If contextual typing takes place, these functions should work.
// Otherwise, the arrow functions' parameters will be typed as 'any',
// and it is an error to invoke an any-typed value with type arguments,
// so this test will error.
tempTag2`${(x)=>{
    x(undefined);
    return x;
}}${0}`;
tempTag2`${(x)=>{
    x(undefined);
    return x;
}}${(y)=>{
    y(null);
    return y;
}}${"hello"}`;
tempTag2`${(x)=>{
    x(undefined);
    return x;
}}${undefined}${"hello"}`;
