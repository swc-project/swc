export const obj = {
    eq: function(b, a) {
        return a >= 0 ? b(this[a]) : b(this[this.length + a]);
    }
};
