class Test0 {
}
class Test extends Test0 {
    constructor(){
        var _this;
        super(), _this = this, console.log(/*#__PURE__*/ function() {
            var _ref = _async_to_generator(function*(e) {
                yield _this.test();
            });
            return function(e) {
                return _ref.apply(this, arguments);
            };
        }());
    }
}
