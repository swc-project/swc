function left() {
    return(// left binop
    check() || action(), foo());
}
function right() {
    return check() || // right binop
    action(), foo();
}
function between() {
    // between
    return check() || action(), foo();
}
function end() {
    return check() || action(), foo();
} // end
export { left, right, between, end };
