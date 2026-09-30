function F() {
    return (function() {
        return { get [new.target === undefined ? "value" : "wrong"]() { return true; } };
    })();
}
console.log(new F().value);
