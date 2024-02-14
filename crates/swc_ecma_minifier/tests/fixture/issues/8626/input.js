export function foo(cb) {
    cb();
}

foo((a, b) => true);
