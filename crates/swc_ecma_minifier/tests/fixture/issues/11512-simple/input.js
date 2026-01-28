// Test that functions with side-effect-free default parameters can be inlined
function identity(x, y = 42) { return x; }

// Use the function multiple times so it goes through simple_functions path
export function test() {
    return identity(1) + identity(2) + identity(3);
}
