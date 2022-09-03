const n = 10, o = 5;
function t(n, o) {
    return ((n % o) + o) % o;
}
console.log(t(n, n + o));
