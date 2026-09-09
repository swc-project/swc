function getKeys(Object) {
    return Object.keys({
        1: "x"
    });
}
console.log(getKeys({
    keys () {
        return [
            "custom"
        ];
    }
}));
