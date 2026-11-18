function foo() {}

function foo() {
    function bar() {}
}

///////////////////
{
    function foo() {}
}

{
    {
        function foo() {}
    }
}

if (true) {
    function foo() {}
}

try {
    function foo() {}
} catch (e) {
    function foo() {}
} finally {
    function foo() {}
}

switch (x) {
    default: {
        function foo() {}
    }
}
