const n = (n)=>(function() {
        return n;
    })();
const o = (n)=>((n)=>n)();
console.log(n(1), n(2), o(3), o(4));
