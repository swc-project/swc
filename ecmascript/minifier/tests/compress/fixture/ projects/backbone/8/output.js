function foo() {
    return model.validationError ? (this.trigger("invalid", this, model.validationError, options), !1) : model;
}
