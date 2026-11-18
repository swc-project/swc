export function left() {
    // left binop
    if (!check()) action();
    return foo();
}

export function right() {
    if (!check())
        // right binop
        action();
    return foo();
}

export function between() {
    if (!check()) action();
    // between
    return foo();
}

export function end() {
    if (!check()) action();
    return foo(); // end
}
