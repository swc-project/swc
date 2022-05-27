export const obj = {
    clone: function(a, b) {
        a = a == null ? false : a;
        b = b == null ? a : b;
        return this.map(function() {
            return jQuery.clone(this, a, b);
        });
    }
};
