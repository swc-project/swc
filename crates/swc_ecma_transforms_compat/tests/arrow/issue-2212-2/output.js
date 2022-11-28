const foo = function() {
    var _this = this;
    (function() {
        return function() {
            return function() {
                return _this;
            };
        };
    });
};
