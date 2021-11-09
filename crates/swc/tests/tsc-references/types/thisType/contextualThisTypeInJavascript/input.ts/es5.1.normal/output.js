// @allowJs: true
// @checkJs: true
// @noEmit: true
// @Filename: context.js
var obj = {
    prop: 2,
    method: function() {
        this;
        this.prop;
        this.method;
        this.unknown; // ok, obj has a string indexer
    }
};
