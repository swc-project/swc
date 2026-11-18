function* setGenerator() {
    console.log("set generator");
    yield 1;
}

new Set(setGenerator());

function* mapGenerator() {
    console.log("map generator");
    yield ["key", "value"];
}

new Map(mapGenerator());

const setIterator = {
    [Symbol.iterator]() {
        console.log("set iterator");
        let first = true;

        return {
            next() {
                console.log("set next");

                if (first) {
                    first = false;
                    return { done: false, value: 1 };
                }

                return { done: true };
            },
        };
    },
};

new Set(setIterator);

const mapIterator = {
    [Symbol.iterator]() {
        console.log("map iterator");
        let first = true;

        return {
            next() {
                console.log("map next");

                if (first) {
                    first = false;
                    return { done: false, value: ["key", "value"] };
                }

                return { done: true };
            },
        };
    },
};

new Map(mapIterator);
