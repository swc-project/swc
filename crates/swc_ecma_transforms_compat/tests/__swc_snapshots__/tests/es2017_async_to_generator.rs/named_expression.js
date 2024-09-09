var foo = /*#__PURE__*/ function() {
    var _bar = _async_to_generator(function*() {
        console.log(bar);
    });
    function bar() {
        return _bar.apply(this, arguments);
    }
    return bar;
}();
