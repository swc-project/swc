// Should NOT inline - different values passed
function add(a, b) {
    return a + b;
}
console.log(add(1, 2));
console.log(add(3, 4));
console.log(add(5, 6));
