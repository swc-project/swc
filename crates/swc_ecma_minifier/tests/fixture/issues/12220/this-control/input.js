function F() {
    return (function() {
        return () => this;
    })();
}
console.log(new F()() === globalThis);
