class Value {
    constructor(public value = "constructor", readonly other: string) {
        value = value;
        console.log(value, other);
    }
}

new Value("value", "other");
