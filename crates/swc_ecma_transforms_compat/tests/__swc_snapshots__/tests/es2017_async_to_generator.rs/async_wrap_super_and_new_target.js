class Foo {
    constractur() {
        var _newtarget = new.target;
        const foo = /*#__PURE__*/ function() {
            var _ref = _async_to_generator(function*() {
                return _newtarget;
            });
            return function foo() {
                return _ref.apply(this, arguments);
            };
        }();
    }
    hello() {
        var _this = this, _superprop_get_hello = ()=>super.hello;
        const world = /*#__PURE__*/ function() {
            var _ref = _async_to_generator(function*() {
                return _superprop_get_hello().call(_this);
            });
            return function world() {
                return _ref.apply(this, arguments);
            };
        }();
    }
}
