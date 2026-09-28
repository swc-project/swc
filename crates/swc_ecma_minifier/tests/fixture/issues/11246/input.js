const TRACK_MEMO_SYMBOL = Symbol();

const obj = new Proxy({}, {
    has: (target, p) => {
        if (p === TRACK_MEMO_SYMBOL) {
            console.log('sideEffect');
        }
        return target[p];
    }
});

TRACK_MEMO_SYMBOL in obj;
