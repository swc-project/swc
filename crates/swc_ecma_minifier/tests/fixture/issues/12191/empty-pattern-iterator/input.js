const iterable = {
    [Symbol.iterator]() {
        console.log("iterator");
        return {
            next() {
                console.log("next");
                return { done: false, value: 1 };
            },
            return() {
                console.log("return");
                return { done: true };
            }
        };
    }
};

[] = iterable;
