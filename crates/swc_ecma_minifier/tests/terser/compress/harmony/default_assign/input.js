function f(a, b = 3) {
    console.log(a);
}
g = ([[] = 123]) => {};
h = ([[x, y, z] = [4, 5, 6]] = []) => {};
function i([[x, y, z] = [4, 5, 6]] = []) {
    console.log(b);
}
