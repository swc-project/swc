const TRACK_MEMO_SYMBOL = Symbol(), obj = new Proxy({}, {
    has: (target, p)=>(p === TRACK_MEMO_SYMBOL && console.log('sideEffect'), target[p])
});
TRACK_MEMO_SYMBOL in obj;
