const iterable = {
    [Symbol.iterator]: ()=>(console.log("iterator"), {
            next: ()=>(console.log("next"), {
                    done: !1,
                    value: 1
                }),
            return: ()=>(console.log("return"), {
                    done: !0
                })
        })
};
[] = iterable;
