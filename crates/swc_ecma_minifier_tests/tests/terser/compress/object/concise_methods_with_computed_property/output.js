var foo = {
    [Symbol.iterator]() {
        return {};
    },
    [3]() {
        return 3;
    },
    ["14"]() {
        return 14;
    },
};
