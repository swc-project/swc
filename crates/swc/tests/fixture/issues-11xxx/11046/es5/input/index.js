function* traverse(obj) {
    for (let key of Object.keys(obj)) {
        if (typeof obj[key] === "object") yield* traverse(obj[key]);
        else yield obj[key];
    }
}

const obj = {
    data: [1, 2, 3],
    nested: {
        fieldName: "Nested",
        fieldData: "Data",
    },
    get dataGenerator() {
        return traverse(this);
    },
};

function func1() {
    const generator = (function () {
        return obj.dataGenerator;
    })();

    const res = [];
    for (let value of generator) {
        res.push(value);
    }

    return res;
}

function main() {
    const res = func1();
    console.log(res);
}

main();
