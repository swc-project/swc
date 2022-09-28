a = 42;
console.log({
    p: function() {
        return (function() {
            return this.a;
        })();
    }
}.p());
