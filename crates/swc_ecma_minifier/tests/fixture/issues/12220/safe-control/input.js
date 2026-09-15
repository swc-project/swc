function F() {
    return (function () {
        return undefined;
    })();
}

console.log(new F() instanceof F);
