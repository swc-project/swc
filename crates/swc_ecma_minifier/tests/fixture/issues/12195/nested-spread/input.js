const iterable = {
    [Symbol.iterator]() {
        console.log("iterate");
        return {
            next() {
                return { done: true };
            },
        };
    },
};

console.log("A".toLowerCase(Math.max(...iterable)));
