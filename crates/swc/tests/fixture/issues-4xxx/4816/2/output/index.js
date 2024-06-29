function left() {
    return(// left binop
    check() || action(), foo());
}
function right() {
    return check() || // right binop
    action(), foo();
}
export { left, right };
