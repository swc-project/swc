var method = 1;
let Foo = _decorate([
    decorator
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
                key: "method",
                value: function method1() {
                    return method;
                }
            }
        ]
    };
});
