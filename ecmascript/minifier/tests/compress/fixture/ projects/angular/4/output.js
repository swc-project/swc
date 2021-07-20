export const obj = {
    eq: function(index) {
        return jqLite(index >= 0 ? this[index] : this[this.length + index]);
    }
};
