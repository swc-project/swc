
hoist_vars: {
    options = {
        hoist_vars: true
    }
    input: {
        function a() {
            bar();
            var var1;
            var var2;
        }
        function b(anArg) {
            bar();
            var var1;
            var anArg;
        }
    }
    expect: {
        function a() {
            var var1, var2;  // Vars go up and are joined
            bar();
        }
        function b(anArg) {
            var var1;
            bar();
            // But vars named like arguments go away!
        }
    }
}

hoist_funs: {
    options = {
        hoist_funs: true
    }
    input: {
        function a() {
            bar();
            function foo() {}
        }
    }
    expect: {
        function a() {
            function foo() {}  // Funs go up
            bar();
        }
    }
}

hoist_no_destructurings: {
    options = {
        hoist_vars: true,
        hoist_funs: true
    }
    input: {
        function a([anArg]) {
            bar();
            var var1;
            var anArg;  // Because anArg is already declared, this goes away!
        }
    }
    expect: {
        function a([anArg]) {
            var var1;
            bar();
        }
    }
}

dont_hoist_var_destructurings: {
    options = {
        hoist_vars: true,
        hoist_funs: true
    }
    input: {
        function x() {
            // If foo is null or undefined, this should be an exception
            var {x,y} = foo;
        }
    }
    expect: {
        function x() {
            var {x,y} = foo;
        }
    }
}
