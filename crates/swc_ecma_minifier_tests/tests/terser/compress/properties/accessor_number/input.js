var a = 1;
var b = {
    get 42() {
        return a;
    },
    set 42(c) {
        a = c;
    },
};
console.log(b[42], (b[42] = 2), b[42]);
