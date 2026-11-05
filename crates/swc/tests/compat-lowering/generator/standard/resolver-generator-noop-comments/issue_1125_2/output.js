function _test() {
    _test = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        ,
                        2,
                        3
                    ]);
                    return [
                        4,
                        1
                    ];
                case 1:
                    _state.sent();
                    return [
                        3,
                        3
                    ];
                case 2:
                    console.log(2);
                    return [
                        7
                    ];
                case 3:
                    return [
                        2
                    ];
            }
        });
    });
    return _test.apply(this, arguments);
}
function test() {
    return _test.apply(this, arguments);
}
test();
