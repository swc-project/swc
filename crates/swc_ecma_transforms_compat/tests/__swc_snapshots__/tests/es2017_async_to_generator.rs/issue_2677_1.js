function region() {
    return _region.apply(this, arguments);
}
function _region() {
    _region = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    });
    return _region.apply(this, arguments);
}
export function otherCall() {
    return _otherCall.apply(this, arguments);
}
function _otherCall() {
    _otherCall = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        region()
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _otherCall.apply(this, arguments);
}
export default function someCall() {
    return _someCall.apply(this, arguments);
}
function _someCall() {
    _someCall = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        region()
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    });
    return _someCall.apply(this, arguments);
}
