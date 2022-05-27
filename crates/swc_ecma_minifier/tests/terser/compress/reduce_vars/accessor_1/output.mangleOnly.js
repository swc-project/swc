var a = 1;
console.log({
    get a () {
        a = 2;
        return a;
    },
    b: 1
}.b, a);
