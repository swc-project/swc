export const obj = {
    set: function (key, value) {
        if (!this[key] || this.hasOwnProperty(key)) this[key] = value;
        return this;
    },
}