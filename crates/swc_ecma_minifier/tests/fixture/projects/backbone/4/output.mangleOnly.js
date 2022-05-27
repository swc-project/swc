function a(a, b) {
    if (!b.validate || !this.validate) return !0;
    a = _.extend({}, this.attributes, a);
    var c = (this.validationError = this.validate(a, b) || null);
    if (!c) return !0;
    return (this.trigger("invalid", this, c, _.extend(b, {
        validationError: c
    })), !1);
}
