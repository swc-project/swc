import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
_async_to_generator(function() {
    var a, b, _;
    return _ts_generator(this, function(_state) {
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
