const iterable = {
    [Symbol.iterator]: ()=>(console.log("iterate"), {
            next: ()=>({
                    done: !0
                })
        })
};
console.log("A".toLowerCase(Math.max(...iterable)));
