const noIterator = {
    get [Symbol.iterator]() {
        console.log("get iterator");
        throw new Error("iterator");
    }
};

try {
    [] = noIterator;
} catch {
    console.log("iterator error");
}

const badClose = {
    [Symbol.iterator]() {
        console.log("iterator");
        return {
            next() {
                return { done: false, value: 1 };
            },
            return() {
                console.log("return");
                throw new Error("return");
            }
        };
    }
};

try {
    [] = badClose;
} catch {
    console.log("return error");
}
