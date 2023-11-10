const classes = [];
for(let i = 0; i <= 10; ++i){
    classes.push(function() {
        class A {
            getBar() {
                return _class_private_field_get(this, _bar);
            }
            constructor(){
                _define_property(this, i, `computed field ${i}`);
                _bar.set(this, {
                    writable: true,
                    value: `private field ${i}`
                });
            }
        }
        _define_property(A, 'foo', `static field ${i}`);
        var _bar = new WeakMap();
        return A;
    }());
}
