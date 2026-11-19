const defaultMessage = "hello"

function foo(a, b = defaultMessage) {
    return a;
}

function bar(x, y, z = 42) {
    return x + y;
}

export function example() {
    return foo(1) + bar(2, 3);
}
