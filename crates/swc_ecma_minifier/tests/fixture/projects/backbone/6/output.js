function foo() {
    return !error || (this.trigger("invalid", this, error, _.extend(options, {
        validationError: error
    })), !1);
}
