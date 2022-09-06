class e {
    get ["a"]() {
        return "A";
    }
    set ["a"](e) {
        do_something(a);
    }
}
var r = {
    get [a.b]() {
        return 42;
    },
};
class s extends Array {
    get [Symbol.species]() {
        return Array;
    }
}
