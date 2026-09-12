class Value {
    value;
    other;
    constructor(value = "constructor", other){
        this.value = value;
        this.other = other;
        console.log(value, other);
    }
}
new Value("value", "other");
