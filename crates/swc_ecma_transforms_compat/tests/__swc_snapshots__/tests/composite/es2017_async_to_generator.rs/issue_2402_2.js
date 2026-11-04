function MyClass(item) {
    this.item = item;
    console.log('Constructor | this.item', this.item);
}
MyClass.prototype.fun = function fun() {
    return _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            console.log('fun | this.item', this.item);
            return [
                2,
                this.item
            ];
        });
    }).call(this);
};
const tmp = new MyClass({
    foo: 'bar'
});
tmp.fun().then((res)=>{
    console.log('fun result | item', res);
});
