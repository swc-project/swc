function foo__2() {
    const r__3 = ()=>1;
    if (true) {
        function r__4() {
            return 2;
        }
    }
    console.log(r__3());
}
function bar__2() {
    var r__6 = ()=>1;
    if (true) {
        function r__6() {
            return 2;
        }
    }
    console.log(r__6());
}
function baz__2() {
    function r__9() {
        return 1;
    }
    if (true) {
        function r__9() {
            return 2;
        }
    }
    console.log(r__9());
}
function quz__2(r__13 = ()=>1) {
    if (true) {
        function r__14() {
            return 2;
        }
    }
    console.log(r__13());
}
