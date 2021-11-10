function f1() {
    var self = {
        inner: function () {
            return self;
        },
    };
}
function f2() {
    var self = { inner: self };
}
