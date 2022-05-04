function f1() {
    // Type parameters are in scope in parameters and return types
    function f<T>(x: T): T {
        return undefined;
    }
}

function f2() {
    // Local types are not in scope in parameters and return types
    function f(x: T): T {
        interface T {}
        return undefined;
    }
}

function f3() {
    // Type parameters and top-level local types are in same declaration space
    function f<T>() {
        interface T {}
        return undefined;
    }
}
