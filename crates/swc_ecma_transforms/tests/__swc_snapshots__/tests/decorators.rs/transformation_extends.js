let A = _decorate([
    dec
], function(_initialize, _B) {
    class A extends _B {
        constructor(...args){
            super(...args);
            _initialize(this);
        }
    }
    return {
        F: A,
        d: []
    };
}, B);
