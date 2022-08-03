function n() {
    return t();
}
function t() {
    return t["call" + "er"].arguments;
}
console.log(n(1, 2, 3).length);
