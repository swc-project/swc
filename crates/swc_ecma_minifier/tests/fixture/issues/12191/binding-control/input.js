function* values() {
    try {
        console.log("next");
        yield 1;
    } finally {
        console.log("return");
    }
}

let value;
[value] = values();
console.log(value);
