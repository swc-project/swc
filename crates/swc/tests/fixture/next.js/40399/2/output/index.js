var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
_async_to_generator._(function() {
    var a, b, _;
    return _ts_generator._(this, function(_state) {
        switch(_state.label){
            case 0:
                return [
                    4,
                    1
                ];
            case 1:
                a = _state.sent();
                expect(a).toBe(1);
                _ = function(x) {
                    return x + x;
                };
                return [
                    4,
                    2
                ];
            case 2:
                b = _.apply(void 0, [
                    _state.sent()
                ]);
                expect(b).toBe(4);
                return [
                    2
                ];
        }
    });
})();
