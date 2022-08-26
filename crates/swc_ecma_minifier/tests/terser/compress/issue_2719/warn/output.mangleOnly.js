function n() {
    return r();
}
function r() {
    return r["call" + "er"].arguments;
}
console.log(n(1, 2, 3).length);
