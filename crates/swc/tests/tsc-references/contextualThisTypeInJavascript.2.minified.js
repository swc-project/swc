//// [context.js]
var obj = {
    prop: 2,
    method: function() {
        this.prop, this.method, this.unknown;
    }
};
