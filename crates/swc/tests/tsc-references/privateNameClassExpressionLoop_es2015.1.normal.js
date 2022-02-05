// @target: es2015
const array = [];
for(let i = 0; i < 10; ++i){
    array.push(function() {
        var _method = new WeakSet(), _accessor = new WeakSet(), _accessor = new WeakSet();
        class C {
            constructor(){
                _myField.set(this, {
                    writable: true,
                    value: "hello"
                });
                _method.add(this);
                _accessor.add(this);
                _accessor.add(this);
            }
        }
        var _myField = new WeakMap();
        function method() {}
        function accessor() {
            return 42;
        }
        function accessor(val) {}
        return C;
    }());
}
