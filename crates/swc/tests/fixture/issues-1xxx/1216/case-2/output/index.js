import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
var source = Math.random() < 2 ? "matilda" : "fred";
var details = {
    _id: "1"
};
function request(path) {
    return _request.apply(this, arguments);
}
function _request() {
    _request = _async_to_generator(function(path) {
        return _ts_generator(this, function(_state) {
            return [
                2,
                "success:".concat(path)
            ];
        });
    });
    return _request.apply(this, arguments);
}
_async_to_generator(function() {
    var obj, _tmp, _tmp1;
    return _ts_generator(this, function(_state) {
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
                _tmp1 = {};
                console.log((_tmp1.obj = obj, _tmp1));
                return [
                    2
                ];
        }
    });
})();
