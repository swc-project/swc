import * as swcHelpers from "@swc/helpers";
var ref = it.next();
ref.value, ref.done, f50(function(kind, data) {
    "A" === kind && data.toFixed(), "B" === kind && data.toUpperCase();
}), readFile("hello", function(err, data) {
    null === err ? data.length : err.message;
});
var reducer = function(op, args) {
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
