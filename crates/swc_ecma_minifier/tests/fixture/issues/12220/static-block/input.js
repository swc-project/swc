function F() {
    return (function () {
        return class {
            static {
                this.value = new.target;
            }
        };
    })();
}

console.log(new F().value === undefined);
