let A = _decorate([
    dec()
], function(_initialize) {
    class A {
        constructor(){
            _initialize(this);
        }
    }
    return {
        F: A,
        d: []
    };
});
