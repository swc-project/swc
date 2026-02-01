// Test that functions with side-effect-free default parameters can be inlined
// Use the function multiple times so it goes through simple_functions path
export function test() {
    return 6;
}
