export const obj = {
    set: function(key, val, options) {
        var attr, attrs, unset, changes, silent, changing, prev, current;
        if (null == key) return this;
        // Run validation.
        if ("object" == typeof key ? (attrs = key, options = val) : (attrs = {})[key] = val, options || (options = {}), !this._validate(attrs, options)) return !1;
        // For each `set` attribute, update or delete the current value.
        for(attr in // Extract attributes and options.
        unset = options.unset, silent = options.silent, changes = [], changing = this._changing, this._changing = !0, changing || (this._previousAttributes = _.clone(this.attributes), this.changed = {}), current = this.attributes, prev = this._previousAttributes, this.idAttribute in attrs && (this.id = attrs[this.idAttribute]), attrs)val = attrs[attr], _.isEqual(current[attr], val) || changes.push(attr), _.isEqual(prev[attr], val) ? delete this.changed[attr] : this.changed[attr] = val, unset ? delete current[attr] : current[attr] = val;
        // Trigger all relevant attribute changes.
        if (!silent) {
            changes.length && (this._pending = !0);
            for(var i = 0, l = changes.length; i < l; i++)this.trigger("change:" + changes[i], this, current[changes[i]], options);
        }
        // You might be wondering why there's a `while` loop here. Changes can
        // be recursively nested within `"change"` events.
        if (changing) return this;
        if (!silent) for(; this._pending;)this._pending = !1, this.trigger("change", this, options);
        return this._pending = !1, this._changing = !1, this;
    }
};
