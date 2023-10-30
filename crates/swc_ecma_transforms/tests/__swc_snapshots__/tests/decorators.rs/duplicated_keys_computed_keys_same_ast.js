let Foo = _decorate([
    (_)=>desc = _
], function(_initialize) {
    class Foo {
        constructor(){
            _initialize(this);
        }
    }
    return {
        F: Foo,
        d: [
            {
                kind: "method",
                key: getKey(),
                value: function() {
                    return 1;
                }
            },
            {
                kind: "method",
                key: getKey(),
                value: function() {
                    return 2;
                }
            }
        ]
    };
});
