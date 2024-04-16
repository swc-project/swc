export function foo(e) {
    let reserved, reserved = 1;
    return e && (reserved = 2), [
        reserved,
        (reserved = 1, e && (reserved = 2), reserved)
    ];
}
