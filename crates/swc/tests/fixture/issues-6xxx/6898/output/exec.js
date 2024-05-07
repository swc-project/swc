var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
_async_to_generator._(function() {
    var _loop, arr, i;
    return _ts_generator._(this, function(_state) {
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
