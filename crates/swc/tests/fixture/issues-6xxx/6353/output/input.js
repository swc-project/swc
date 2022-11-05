import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
(function() {
    var _ref = _async_to_generator(function*(x) {
        return 0;
    });
    return function(x) {
        return _ref.apply(this, arguments);
    };
})().x++;
(function() {
    var _ref = _async_to_generator(function*(x) {
        return 0;
    });
    return function(x) {
        return _ref.apply(this, arguments);
    };
})().x--;
++function() {
    var _ref = _async_to_generator(function*(x) {
        return 0;
    });
    return function(x) {
        return _ref.apply(this, arguments);
    };
}().x;
--function() {
    var _ref = _async_to_generator(function*(x) {
        return 0;
    });
    return function(x) {
        return _ref.apply(this, arguments);
    };
}().x;
(function() {
    var _ref = _async_to_generator(function*(x) {
        return 0;
    });
    return function(x) {
        return _ref.apply(this, arguments);
    };
})()`y`;
