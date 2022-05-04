function a() {}
function foo() {
    function b() {
        a();
    }
    function a() {}
}
