function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
}
class ArgumentValidationError extends Error {
    constructor(validationErrors){
        super("Argument Validation Error"), _define_property(this, "validationErrors", void 0), this.validationErrors = validationErrors;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
