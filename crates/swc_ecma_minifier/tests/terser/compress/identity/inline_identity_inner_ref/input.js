const id = (a) =>
    (function () {
        return a;
    })();
const undef = (a) => ((a) => a)();
console.log(id(1), id(2), undef(3), undef(4));
