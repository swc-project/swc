let a = {
    a: 0
};
let b = {
    a: 0
};
function foo(x) {
    let a = x; // Error
    let b = x; // Error
}
