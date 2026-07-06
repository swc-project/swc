function foo__2() {
    const r__3 = ()=>1;
    if (true) {
        function r__5() {
            return 2;
        }
    }
    console.log(r__3());
}
function bar__2() {
    var r__7 = ()=>1;
    if (true) {
        function r__7() {
            return 2;
        }
    }
    console.log(r__7());
}
function baz__2() {
    function r__11() {
        return 1;
    }
    if (true) {
        function r__11() {
            return 2;
        }
    }
    console.log(r__11());
}
function quz__2(r__15 = ()=>1) {
    if (true) {
        function r__17() {
            return 2;
        }
    }
    console.log(r__15());
}
