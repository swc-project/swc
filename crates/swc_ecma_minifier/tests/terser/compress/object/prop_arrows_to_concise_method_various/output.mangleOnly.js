({
    null: (a, b)=>{
        a(b);
    },
    123: (a, b)=>{
        a(b);
    },
    "A B": (a, b)=>{
        a(b);
    },
    p1: (a, b)=>{
        a(b);
    },
    p3: async (a, b)=>{
        await a(b);
    },
    [c1]: (a, b)=>{
        a(b);
    },
    [c3]: async (a, b)=>{
        await a(b);
    }
});
