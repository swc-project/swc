export const obj = {
    changedAttributes: function(diff) {
        if (!diff) return !!this.hasChanged() && _.clone(this.changed);
        var val, changed = !1, old = this._changing ? this._previousAttributes : this.attributes;
        for(var attr in diff)_.isEqual(old[attr], val = diff[attr]) || ((changed || (changed = {}))[attr] = val);
        return changed;
    }
};
