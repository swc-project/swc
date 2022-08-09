export const obj = {
    clone: function(n, t) {
        n = n == null ? false : n;
        t = t == null ? n : t;
        return this.map(function() {
            return jQuery.clone(this, n, t);
        });
    }
};
