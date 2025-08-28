//// [dependentDestructuredVariables.ts]
import "@swc/helpers/_/_async_to_generator";
import "@swc/helpers/_/_wrap_async_generator";
let { value, done } = it.next();
f50((kind, data)=>{
    'A' === kind && data.toFixed(), 'B' === kind && data.toUpperCase();
}), readFile('hello', (err, data)=>{
    null === err ? data.length : err.message;
});
let reducer = (op, args)=>{
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
let bot = new Client();
bot.on("shardDisconnect", (event, shard)=>console.log(`Shard ${shard} disconnected (${event.code},${event.wasClean}): ${event.reason}`)), bot.on("shardDisconnect", (event)=>console.log(`${event.code} ${event.wasClean} ${event.reason}`));
