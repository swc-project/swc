class C {
    get ["a"]() {
        return "A";
    }
    set ["a"](value) {
        do_something(a);
    }
}
var x = {
    get [a.b]() {
        return 42;
    },
};
class MyArray extends Array {
    get [Symbol.species]() {
        return Array;
    }
}
