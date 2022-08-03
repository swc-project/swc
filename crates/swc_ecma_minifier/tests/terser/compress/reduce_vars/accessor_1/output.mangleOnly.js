var r = 1;
console.log({
    get a () {
        r = 2;
        return r;
    },
    b: 1
}.b, r);
