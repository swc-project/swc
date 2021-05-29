var g = ["a"];
function problem(arg) {
    return g.indexOf(arg);
}
function unused(arg) {
    return problem(arg);
}
function a(arg) {
    return problem(arg);
}
function b(test) {
    var problem = test * 2;
    console.log(problem);
    return g[problem];
}
function c(arg) {
    return b(a(arg));
}
console.log(c("a"));
