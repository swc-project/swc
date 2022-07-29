var i = {
    [Symbol.iterator]: {
        p: null
    },
    [Symbol.toStringTag] () {
        return {
            p: void 0
        };
    }
};
i[Symbol.iterator], i[Symbol.toStringTag]();
