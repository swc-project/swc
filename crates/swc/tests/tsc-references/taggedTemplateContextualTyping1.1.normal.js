//// [taggedTemplateContextualTyping1.ts]
function tempTag1(...rest) {
    return undefined;
}
// If contextual typing takes place, these functions should work.
// Otherwise, the arrow functions' parameters will be typed as 'any',
// and it is an error to invoke an any-typed value with type arguments,
// so this test will error.
tempTag1`${(x)=>{
    x(undefined);
    return x;
}}${10}`;
tempTag1`${(x)=>{
    x(undefined);
    return x;
}}${(y)=>{
    y(undefined);
    return y;
}}${10}`;
tempTag1`${(x)=>{
    x(undefined);
    return x;
}}${(y)=>{
    y(undefined);
    return y;
}}${undefined}`;
tempTag1`${(x)=>{
    x(undefined);
    return x;
}}${(y)=>{
    y(undefined);
    return y;
}}${undefined}`;
