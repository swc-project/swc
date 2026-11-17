let write;
let read;
function register(fn) {
    write = fn;
    return "method";
}
function registerRead(fn) {
    read = fn;
    return "other";
}

// A callback stored by a computed key mutates the class.
class C {
    [register(() => {
        C.value = 42;
        return C.value;
    })]() {}
    static cache = console.log("init C");
}

// A callback stored by a computed key only reads the class.
class D {
    [registerRead(() => D.name)]() {}
    static cache = console.log("init D");
}

console.log(write(), read());
