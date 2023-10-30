function requester() {
    return pureRequester;
    function pureRequester() {
        return _pureRequester.apply(this, arguments);
    }
    function _pureRequester() {
        _pureRequester = _async_to_generator(function() {
            function refreshThenRequest() {
                return _refreshThenRequest.apply(this, arguments);
            }
            function _refreshThenRequest() {
                _refreshThenRequest = _async_to_generator(function() {
                    return _ts_generator(this, function(_state) {
                        return [
                            2
                        ];
                    });
                });
                return _refreshThenRequest.apply(this, arguments);
            }
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        return [
                            4,
                            refreshThenRequest()
                        ];
                    case 1:
                        _state.sent();
                        return [
                            2,
                            true
                        ];
                }
            });
        });
        return _pureRequester.apply(this, arguments);
    }
}
