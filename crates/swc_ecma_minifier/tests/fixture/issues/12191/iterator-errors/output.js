const noIterator = {
    get [Symbol.iterator] () {
        throw console.log("get iterator"), Error("iterator");
    }
};
try {
    [] = noIterator;
} catch  {
    console.log("iterator error");
}
const badClose = {
    [Symbol.iterator]: ()=>(console.log("iterator"), {
            next: ()=>({
                    done: !1,
                    value: 1
                }),
            return () {
                throw console.log("return"), Error("return");
            }
        })
};
try {
    [] = badClose;
} catch  {
    console.log("return error");
}
