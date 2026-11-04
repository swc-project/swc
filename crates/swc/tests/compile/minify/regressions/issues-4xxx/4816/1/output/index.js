export function left() {
    return(// left binop
    check() || action(), foo());
}
export function right() {
    return check() || // right binop
    action(), foo();
}
export function between() {
    // between
    return check() || action(), foo();
}
export function end() {
    return check() || action(), foo();
} // end
