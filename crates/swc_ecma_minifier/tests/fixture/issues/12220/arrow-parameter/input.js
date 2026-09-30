function F() {
    return (function() {
        return (target = new.target) => target;
    })();
}
console.log(new F()() === undefined);
