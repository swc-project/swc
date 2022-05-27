a = 42;
console.log({
    p: ()=>(function() {
            return this.a;
        })()
}.p());
