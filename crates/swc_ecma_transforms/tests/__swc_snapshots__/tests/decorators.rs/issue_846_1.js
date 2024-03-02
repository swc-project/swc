let SomeClass = _decorate([], function(_initialize) {
    class SomeClass {
        constructor(){
            _initialize(this);
        }
    }
    return {
        F: SomeClass,
        d: [
            {
                kind: "method",
                decorators: [
                    dec
                ],
                key: "someMethod",
                value: function someMethod() {}
            }
        ]
    };
});
let OtherClass = _decorate([], function(_initialize, _SomeClass) {
    class OtherClass extends _SomeClass {
        constructor(...args){
            super(...args);
            _initialize(this);
        }
    }
    return {
        F: OtherClass,
        d: [
            {
                kind: "method",
                decorators: [
                    dec
                ],
                key: "anotherMethod",
                value: function anotherMethod() {
                    _get(_get_prototype_of(OtherClass.prototype), "someMethod", this).call(this);
                }
            }
        ]
    };
}, SomeClass);
