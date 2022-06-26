export const obj = {
    eq: function(a, b) {
        return b >= 0 ? a(this[b]) : a(this[this.length + b]);
    }
};
