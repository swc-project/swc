function F() {
    return function() {
        return {
            get [new.target === void 0 ? "value" : "wrong"] () {
                return true;
            }
        };
    }();
}
console.log(new F().value);
