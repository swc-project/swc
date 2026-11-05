var obj = {
    set obj (param){
        var _ref = param === void 0 ? {} : param, a = _ref.a, b = _ref.b;
        this.num = {
            a,
            b
        };
    },
    set arr (param){
        var _ref = _sliced_to_array(param === void 0 ? [] : param, 2), x = _ref[0], y = _ref[1];
        this.num = {
            x,
            y
        };
    }
};
