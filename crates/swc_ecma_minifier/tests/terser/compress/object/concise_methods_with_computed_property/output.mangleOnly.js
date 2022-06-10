var a = {
    [Symbol.iterator] () {
        return {};
    },
    [1 + 2] () {
        return 3;
    },
    ["1" + "4"] () {
        return 14;
    }
};
