const { value , done  } = it.next();
f50((kind, data)=>{
    'A' === kind && data.toFixed(), 'B' === kind && data.toUpperCase();
}), readFile('hello', (err, data)=>{
    null === err ? data.length : err.message;
});
const reducer = (op, args)=>{
    switch(op){
        case "add":
            console.log(args.a + args.b);
            break;
        case "concat":
            console.log(args.firstArr.concat(args.secondArr));
    }
};
reducer("add", {
    a: 1,
    b: 3
}), reducer("concat", {
    firstArr: [
        1,
        2
    ],
    secondArr: [
        3,
        4
    ]
});
