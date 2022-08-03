export const obj = {
    eq: function(t, n) {
        return n >= 0 ? t(this[n]) : t(this[this.length + n]);
    }
};
