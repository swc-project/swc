function f1() {
    var self = {
        inner: function () {
            return self;
        },
    };
    console.log(self)
}
function f2() {
    var self = { inner: self };
    console.log(self)
}

f1()
f2()