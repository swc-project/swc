function test() {
    console.log("test");
    return true;
}

function f(a, b) {
    return b;
}

try {
    test() ? f("".charAt(1n), 1) : f("".charAt(1n), 2);
} catch {
    console.log("caught");
}
