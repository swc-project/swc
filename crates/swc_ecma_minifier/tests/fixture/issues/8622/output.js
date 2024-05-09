export function foo(e) {
    let reserved = 1;
    return e && (reserved = 2), [
        reserved,
        function(e) {
            let reserved = 1;
            return e && (reserved = 2), reserved;
        }(e)
    ];
}
