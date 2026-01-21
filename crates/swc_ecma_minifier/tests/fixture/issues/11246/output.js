// The `in` operator triggers the `has` trap when used with a Proxy.
// It must not be removed as a side-effect-free expression.
const TRACK_MEMO_SYMBOL = Symbol(), obj = new Proxy({}, {
    has: (target, p)=>(p === TRACK_MEMO_SYMBOL && console.log('sideEffect'), target[p])
});
TRACK_MEMO_SYMBOL in obj;
