function a() {}
console.log({
    a: a(),
    p: function() {
        return 42;
    }
}.p());
