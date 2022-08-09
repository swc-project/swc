export const obj = {
    _validate: function(t, i) {
        if (!i.validate || !this.validate) return true;
        t = _.extend({}, this.attributes, t);
        var r = (this.validationError = this.validate(t, i) || null);
        if (!r) return true;
        this.trigger("invalid", this, r, _.extend(i, {
            validationError: r
        }));
        return false;
    }
};
