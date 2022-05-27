class b {
    get ["a"]() {
        return "A";
    }
    set ["a"](b) {
        do_something(a);
    }
}
var c = {
    get [a.b] () {
        return 42;
    }
};
class d extends Array {
    get [Symbol.species]() {
        return Array;
    }
}
