(x = (()=>{
    var _brand_check_foo;
    return _brand_check_foo = new WeakSet(), class {
        #foo = void _brand_check_foo.add(this);
        test(other) {
            return _brand_check_foo.has(other);
        }
    };
})())=>{
};
