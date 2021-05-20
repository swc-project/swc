var a = 1;
var b = {
    get set() {
        return a;
    },
    set get(c) {
        a = c;
    },
};
console.log(b.set, (b.get = 2), b.set);
