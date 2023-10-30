{
    let foo = function foo() {
        return function bar() {
            {
                let baz = function baz() {};
            }
        };
        function baz() {}
        {
            let bar = function bar() {};
            {
                let bar = function bar() {};
            }
        }
    };
}
