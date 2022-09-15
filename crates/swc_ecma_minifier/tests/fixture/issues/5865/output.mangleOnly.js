v = ((n)=>(o)=>{
        const t = n.map((n)=>{
            if (n) return ((n)=>n.foo)(n);
        });
        return t;
    })(r);
