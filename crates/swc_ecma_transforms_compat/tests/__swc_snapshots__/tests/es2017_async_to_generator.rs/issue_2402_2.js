function MyClass(item) {
    this.item = item;
    console.log('Constructor | this.item', this.item);
}
MyClass.prototype.fun = /*#__PURE__*/ function() {
    var _fun = _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            console.log('fun | this.item', this.item);
            return [
                2,
                this.item
            ];
        });
    });
    function fun() {
        return _fun.apply(this, arguments);
    }
    return fun;
}();
const tmp = new MyClass({
    foo: 'bar'
});
tmp.fun().then((res)=>{
    console.log('fun result | item', res);
});
