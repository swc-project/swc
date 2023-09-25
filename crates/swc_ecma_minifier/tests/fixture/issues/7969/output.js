let a = 0;
function f(arr) {
    let b = a;
    return `${arr.map((child)=>{
        a = b + "str";
    })}`;
}
function g(arr) {
    return f(arr);
}
globalThis.g = g;
g([
    1,
    2,
    3
]);
console.log(a);
