//// [context.js]
var obj = {
    prop: 2,
    method: function method() {
        this;
        this.prop;
        this.method;
        this.unknown; // ok, obj has a string indexer
    }
};
