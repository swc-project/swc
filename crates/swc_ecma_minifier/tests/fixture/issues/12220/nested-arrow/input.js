function F() {
    return (function() {
        return () => () => new.target;
    })();
}
console.log(new F()()() === undefined);
