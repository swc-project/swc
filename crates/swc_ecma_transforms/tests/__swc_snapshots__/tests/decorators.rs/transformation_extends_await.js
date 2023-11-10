async function g() {
    let A = _decorate([
        dec
    ], function(_initialize, _super) {
        class A extends _super {
            constructor(...args){
                super(...args);
                _initialize(this);
            }
        }
        return {
            F: A,
            d: []
        };
    }, await B);
}
