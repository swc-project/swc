var _ts_generator = require("@swc/helpers/_/_ts_generator");
function foo() {
    var val, _tmp;
    return _ts_generator._(this, function(_state) {
        switch(_state.label){
            case 0:
                if (!true) return [
                    3,
                    1
                ];
                _tmp = 1;
                return [
                    3,
                    3
                ];
            case 1:
                return [
                    4,
                    0
                ];
            case 2:
                _tmp = _state.sent();
                _state.label = 3;
            case 3:
                val = _tmp;
                console.log({
                    val: val
                });
                return [
                    2
                ];
        }
    });
}
var v = foo();
console.log(v.next());
