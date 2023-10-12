var _this = this;
const a = function() {
    return {
        [_this] (a = this) {
            this;
            arguments;
        }
    };
};
const b = function() {
    return class {
        static [this]() {}
        [arguments]() {}
    };
};
