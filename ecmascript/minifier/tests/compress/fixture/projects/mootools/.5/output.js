export const obj = {
    set: function(key, value) {
        return this[key] && !this.hasOwnProperty(key) || (this[key] = value), this;
    }
};
