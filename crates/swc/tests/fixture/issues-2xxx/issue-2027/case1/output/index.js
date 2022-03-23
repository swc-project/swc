var _loop = function(key) {
    controller[key] = function(c) {
        for(var _len = arguments.length, d = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            d[_key - 1] = arguments[_key];
        }
        console.log(keys[key]);
    };
};
var keys = {
    a: 1,
    b: 2
};
var controller = {};
for(var key in keys)_loop(key);
