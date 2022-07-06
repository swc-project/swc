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
    var r__5 = ()=>1;
    if (true) {
        function r__5() {
            return 2;
        }
    }
    console.log(r__5());
}
function baz__1() {
    function r__6() {
        return 1;
    }
    if (true) {
        function r__6() {
            return 2;
        }
    }
    console.log(r__6());
}
function quz__1(r__7 = ()=>1) {
    if (true) {
        function r__8() {
            return 2;
        }
    }
    console.log(r__7());
}
