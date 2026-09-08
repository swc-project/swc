function result(factory) {
    try {
        return factory().length;
    } catch (error) {
        return error.name;
    }
}
console.log([
    result(()=>Array(0.5)),
    result(()=>Array(1.5)),
    result(()=>[]),
    result(()=>[
            ,
            ,
            ,
            ,
            , 
        ]),
    result(()=>[])
].join(","));
