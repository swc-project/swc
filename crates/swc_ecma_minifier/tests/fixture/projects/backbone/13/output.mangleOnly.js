export const obj = {
    _validate: function(a, b) {
        if (!b.validate || !this.validate) return true;
        a = _.extend({}, this.attributes, a);
        var c = (this.validationError = this.validate(a, b) || null);
        if (!c) return true;
        this.trigger("invalid", this, c, _.extend(b, {
            validationError: c
        }));
        return false;
    }
};
