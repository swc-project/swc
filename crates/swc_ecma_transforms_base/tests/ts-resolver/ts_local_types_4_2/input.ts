function f2() {
    // Local types are not in scope in parameters and return types
    function f(x: T): T {
        interface T {}
        return undefined;
    }
}
