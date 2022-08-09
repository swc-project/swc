class e {
    get ["a"]() {
        return "A";
    }
    set ["a"](e) {
        do_something(a);
    }
}
var s = {
    get [a.b] () {
        return 42;
    }
};
class t extends Array {
    get [Symbol.species]() {
        return Array;
    }
}
