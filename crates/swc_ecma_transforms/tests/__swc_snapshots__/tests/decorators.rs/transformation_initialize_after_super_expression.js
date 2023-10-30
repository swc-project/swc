let B = _decorate([
    dec
], function(_initialize, _A) {
    class B extends _A {
        constructor(){
            var _temp;
            _temp = super(), _initialize(this), _temp;
        }
    }
    return {
        F: B,
        d: []
    };
}, A);
