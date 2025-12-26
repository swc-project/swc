const a = ()=>{
    class _class {
        foo() {
            return class B {
                constructor(){
                    _define_property(this, "b", 456);
                }
            };
        }
        constructor(){
            _define_property(this, "a", 123);
        }
    }
    return _class;
};
