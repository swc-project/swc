var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
var source = Math.random() < 2 ? "matilda" : "fred";
var details = {
    _id: "1"
};
function request(path) {
    return _request.apply(this, arguments);
}
function _request() {
    _request = _async_to_generator._(function(path) {
        return _ts_generator._(this, function(_state) {
            return [
                2,
                "success:".concat(path)
            ];
        });
    });
    return _request.apply(this, arguments);
}
_async_to_generator._(function() {
    var obj, _tmp;
    return _ts_generator._(this, function(_state) {
        switch(_state.label){
            case 0:
                if (!(source === "matilda")) return [
                    3,
                    1
                ];
                _tmp = details;
                return [
                    3,
                    3
                ];
            case 1:
                return [
                    4,
                    request("/".concat(details._id, "?source=").concat(source))
                ];
            case 2:
                _tmp = _state.sent();
                _state.label = 3;
            case 3:
                obj = _tmp;
                console.log({
                    obj: obj
                });
                return [
                    2
                ];
        }
    });
})();
