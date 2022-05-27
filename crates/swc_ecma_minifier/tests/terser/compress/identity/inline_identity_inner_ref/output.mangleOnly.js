const a = (a)=>(function() {
        return a;
    })();
const b = (a)=>((a)=>a)();
console.log(a(1), a(2), b(3), b(4));
