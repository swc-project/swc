function f(undefined) {
    return a ? b : c ? d : undefined;
}
function g(undefined) {
    return a ? b : c ? d : void e();
}
