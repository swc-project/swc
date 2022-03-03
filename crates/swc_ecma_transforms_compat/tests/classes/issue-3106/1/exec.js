class ValidationStrategy {
    static "object?"(value) {
        return 1;
    }

    static "string!"(value) {
        return 2;
    }

    static "eval?"(value) {
        return 3;
    }

    static "arguments!"(value) {
        return 3;
    }
}
console.log(ValidationStrategy.prototype["string!"]);
console.log(ValidationStrategy.prototype["eval?"]);
console.log(ValidationStrategy.prototype["arguments!"]);
