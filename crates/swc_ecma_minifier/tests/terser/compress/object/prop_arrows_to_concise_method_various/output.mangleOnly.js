({
    null: (a, n)=>{
        a(n);
    },
    123: (a, n)=>{
        a(n);
    },
    "A B": (a, n)=>{
        a(n);
    },
    p1: (a, n)=>{
        a(n);
    },
    p3: async (a, n)=>{
        await a(n);
    },
    [c1]: (a, n)=>{
        a(n);
    },
    [c3]: async (a, n)=>{
        await a(n);
    }
});
