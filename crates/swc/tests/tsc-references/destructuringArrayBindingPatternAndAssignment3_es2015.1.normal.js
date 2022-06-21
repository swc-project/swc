const [a, b = a] = [
    1
]; // ok
const [c, d = c, e = e] = [
    1
]; // error for e = e
const [f, g = f, h = i, i = f] = [
    1
]; // error for h = i
(function([a, b = a]) {})([
    1
]);
(function([c, d = c, e = e]) {})([
    1
]);
(function([f, g = f, h = i, i1 = f]) {})([
    1
]);
