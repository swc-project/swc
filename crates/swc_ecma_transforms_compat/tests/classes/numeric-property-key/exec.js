class Example {
    get 1e21() {
        return this.finiteValue;
    }

    set "1e+21"(value) {
        this.finiteValue = value;
    }

    get 1e999() {
        return this.infinityValue;
    }

    set "Infinity"(value) {
        this.infinityValue = value;
    }
}

const instance = new Example();
instance[1e21] = 42;
console.log(instance["1e+21"]);
instance[1e999] = 43;
console.log(instance["Infinity"]);
