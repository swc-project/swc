function n() {}
console.log({
    a: n(),
    p: function() {
        return 42;
    }
}.p());
