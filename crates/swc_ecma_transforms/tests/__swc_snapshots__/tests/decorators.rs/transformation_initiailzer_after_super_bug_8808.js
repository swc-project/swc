let Sub = _decorate([
    decorator(parameter)
], function(_initialize, _Super) {
    class Sub extends _Super {
        constructor(){
            [
                super(),
                _initialize(this)
            ][0].method();
        }
    }
    return {
        F: Sub,
        d: []
    };
}, Super);
