const n = 10, o = 5;
function c(n, o) {
    return ((n % o) + o) % o;
}
console.log(c(n, n + o));
