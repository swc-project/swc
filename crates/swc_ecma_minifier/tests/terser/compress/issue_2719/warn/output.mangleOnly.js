function n() {
    return e();
}
function e() {
    return e["call" + "er"].arguments;
}
console.log(n(1, 2, 3).length);
