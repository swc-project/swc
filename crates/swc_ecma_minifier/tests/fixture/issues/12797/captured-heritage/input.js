let callback;
class Base {}

// A callback stored by the heritage expression mutates the class.
class C extends ((callback = () => {
    C.value = 42;
    return C.value;
}), Base) {
    static set(x) {
        C.value = x;
    }
    static cache = console.log("init");
}

console.log(callback());
