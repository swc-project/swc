import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
_async_to_generator(function() {
    var _loop, arr, i;
    return _ts_generator(this, function(_state) {
        _loop = function(i) {
            var value = arr[i];
            setTimeout(function() {
                console.log('value', value);
            }, 0);
        };
        arr = [
            'value1',
            'value2',
            'value3'
        ];
        // for (const value of arr) {
        for(i = 0; i < arr.length; i++)_loop(i);
        return [
            2
        ];
    });
})();
