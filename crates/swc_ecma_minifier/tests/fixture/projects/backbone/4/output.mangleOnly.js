function t(t, i) {
    if (!i.validate || !this.validate) return !0;
    t = _.extend({}, this.attributes, t);
    var r = (this.validationError = this.validate(t, i) || null);
    if (!r) return !0;
    return (this.trigger("invalid", this, r, _.extend(i, {
        validationError: r
    })), !1);
}
