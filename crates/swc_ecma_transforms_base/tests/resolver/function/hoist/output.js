function foo__1() {
    const r__2 = ()=>1;
    if (true) {
        function r__3() {
            return 2;
        }
    }
    console.log(r__2());
}
function bar__1() {
    var r__6 = ()=>1;
    if (true) {
        function r__6() {
            return 2;
        }
    }
    console.log(r__6());
}
function baz__1() {
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
function quz__1(r__13 = ()=>1) {
    if (true) {
        function r__14() {
            return 2;
        }
    }
    console.log(r__13());
}
