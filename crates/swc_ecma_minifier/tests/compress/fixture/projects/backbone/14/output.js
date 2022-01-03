export const obj = {
    set: function(key, val, options) {
        var attr, attrs, unset, changes, silent, changing, prev, current;
        if (null == key) return this;
        if ("object" == typeof key ? (attrs = key, options = val) : (attrs = {})[key] = val, options || (options = {}), !this._validate(attrs, options)) return !1;
        for(attr in unset = options.unset, silent = options.silent, changes = [], changing = this._changing, this._changing = !0, changing || (this._previousAttributes = _.clone(this.attributes), this.changed = {}), current = this.attributes, prev = this._previousAttributes, this.idAttribute in attrs && (this.id = attrs[this.idAttribute]), attrs)val = attrs[attr], _.isEqual(current[attr], val) || changes.push(attr), _.isEqual(prev[attr], val) ? delete this.changed[attr] : this.changed[attr] = val, unset ? delete current[attr] : current[attr] = val;
        if (!silent) {
            changes.length && (this._pending = !0);
            for(var i = 0, l = changes.length; i < l; i++)this.trigger("change:" + changes[i], this, current[changes[i]], options);
        }
        if (changing) return this;
        if (!silent) for(; this._pending;)this._pending = !1, this.trigger("change", this, options);
        return this._pending = !1, this._changing = !1, this;
    }
};
