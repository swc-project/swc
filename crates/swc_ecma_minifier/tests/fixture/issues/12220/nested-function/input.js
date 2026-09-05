function F() {
    return (function () {
        return (function () {
            return new.target;
        })();
    })();
}

console.log(new F() instanceof F);
