function r() {
    return !model.validationError ? model : (this.trigger("invalid", this, model.validationError, options), !1);
}
