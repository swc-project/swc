function foo(attrs, options) {
    if (!options.validate || !this.validate) return !0;
    attrs = _.extend({}, this.attributes, attrs);
    var error = this.validationError = this.validate(attrs, options) || null;
    return !error || (this.trigger("invalid", this, error, _.extend(options, {
        validationError: error
    })), !1);
}
