function foo() {
    const r = () => 1;
    if (true) {
        function r() {
            return 2;
        }
    }

    console.log(r());
}

function bar() {
    var r = () => 1;
    if (true) {
        function r() {
            return 2;
        }
    }

    console.log(r());
}

function baz() {
    function r() {
        return 1;
    }
    if (true) {
        function r() {
            return 2;
        }
    }

    console.log(r());
}

function quz(r = () => 1) {
    if (true) {
        function r() {
            return 2;
        }
    }

    console.log(r());
}
