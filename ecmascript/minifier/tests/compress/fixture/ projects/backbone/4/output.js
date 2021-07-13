function foo(attrs, options) {
    if (!options.validate || !this.validate) return !0;
    var error = this.validationError = this.validate(attrs = _.extend({
    }, this.attributes, attrs), options) || null;
    return !error || (this.trigger("invalid", this, error, _.extend(options, {
        validationError: error
    })), !1);
}
