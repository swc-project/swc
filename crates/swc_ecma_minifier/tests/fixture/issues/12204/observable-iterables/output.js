function* setGenerator() {
    console.log("set generator"), yield 1;
}
function* mapGenerator() {
    console.log("map generator"), yield [
        "key",
        "value"
    ];
}
new Set(setGenerator()), new Map(mapGenerator());
const setIterator = {
    [Symbol.iterator] () {
        console.log("set iterator");
        let first = !0;
        return {
            next: ()=>(console.log("set next"), first) ? (first = !1, {
                    done: !1,
                    value: 1
                }) : {
                    done: !0
                }
        };
    }
};
new Set(setIterator);
const mapIterator = {
    [Symbol.iterator] () {
        console.log("map iterator");
        let first = !0;
        return {
            next: ()=>(console.log("map next"), first) ? (first = !1, {
                    done: !1,
                    value: [
                        "key",
                        "value"
                    ]
                }) : {
                    done: !0
                }
        };
    }
};
new Map(mapIterator);
