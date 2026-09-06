function F() {
    return (function () {
        return class {
            static p = new.target;
        };
    })();
}

console.log(new F().p === undefined);
