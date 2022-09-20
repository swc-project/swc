export function left() {
    return(// left binop
    check() || action(), foo());
}
export function right() {
    return check() || // right binop
    action(), foo();
}
export function between() {
    return check() || action(), // between
    foo();
}
export function end() {
    return check() || action(), foo();
} // end
