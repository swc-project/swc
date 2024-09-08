function MyClass() {}
MyClass.prototype.handle = function() {
    console.log('this is MyClass handle');
};
MyClass.prototype.init = /*#__PURE__*/ function() {
    var _ref = _async_to_generator(function(param1) {
        var a;
        return _ts_generator(this, function(_state) {
            a = 1;
            if (!param1) {
                console.log(this);
                this.handle();
            }
            if (param1 === a) {
                return [
                    2,
                    false
                ];
            }
            return [
                2,
                true
            ];
        });
    });
    return function(param1) {
        return _ref.apply(this, arguments);
    };
}();
const myclass = new MyClass();
myclass.handle();
