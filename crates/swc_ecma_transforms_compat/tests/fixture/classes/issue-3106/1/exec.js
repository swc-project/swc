class ValidationStrategy {
    static "object?"(value) {
        return 1;
    }

    static "string!"(value) {
        return 2;
    }
}
console.log(ValidationStrategy.prototype['string!']);
