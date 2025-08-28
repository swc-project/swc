export let obj = {
    eq: function(jqLite, index) {
        return jqLite(index >= 0 ? this[index] : this[this.length + index]);
    }
};
