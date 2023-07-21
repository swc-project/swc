import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
function asyncWhile() {
    return _asyncWhile.apply(this, arguments);
}
function _asyncWhile() {
    _asyncWhile = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            while(true){
                return [
                    2,
                    {}
                ];
            }
            return [
                2
            ];
        });
    });
    return _asyncWhile.apply(this, arguments);
}
function generatorWhile() {
    return _ts_generator(this, function(_state) {
        while(true){
            return [
                2,
                {}
            ];
        }
        return [
            2
        ];
    });
}
