function a() {
    var a = {
        inner: function() {
            return a;
        }
    };
}
function b() {
    var a = {
        inner: a
    };
}
