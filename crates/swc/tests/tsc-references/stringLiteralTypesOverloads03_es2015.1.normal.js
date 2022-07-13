// @declaration: true
let hello;
let world;
let helloOrWorld;
function f(...args) {
    return undefined;
}
let fResult1 = f(hello);
let fResult2 = f(world);
let fResult3 = f(helloOrWorld);
function g(...args) {
    return undefined;
}
let gResult1 = g(hello);
let gResult2 = g(world);
let gResult3 = g(helloOrWorld);
