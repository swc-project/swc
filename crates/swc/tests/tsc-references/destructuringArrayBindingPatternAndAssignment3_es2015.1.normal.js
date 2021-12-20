const [a, b = a] = [
    1
]; // ok
const [c, d = c, e = e] = [
    1
]; // error for e = e
const [f, g = f, h = i, i = f] = [
    1
]; // error for h = i
(function([a1, b = a1]) {
})([
    1
]);
(function([c1, d = c1, e1 = e1]) {
})([
    1
]);
(function([f1, g = f1, h = i, i = f1]) {
})([
    1
]);
