function a(a) {
    return (a = {
        p: function() {
            return a;
        }
    });
}
console.log(typeof a().p());
