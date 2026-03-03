// Do not inline optional chain into new expression callee.
// `new foo?.bar()` is a syntax error.
export function foo(XE, e) {
    let t = XE?.default;
    return new t({
        ...e
    });
}
