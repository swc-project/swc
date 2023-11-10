let Sub = _decorate([
    decorator(parameter)
], function(_initialize, _Super) {
    class Sub extends _Super {
        constructor(){
            var _temp;
            (_temp = super(), _initialize(this), _temp).method();
        }
    }
    return {
        F: Sub,
        d: []
    };
}, Super);
