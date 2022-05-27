export function left() {
    return(// left binop
    check() || action(), foo());
}
export function right() {
    return check() || // right binop
    action(), foo();
}
