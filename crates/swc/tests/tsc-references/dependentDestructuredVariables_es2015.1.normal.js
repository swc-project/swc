function f10({ kind , payload  }) {
    if (kind === 'A') {
        payload.toFixed();
    }
    if (kind === 'B') {
        payload.toUpperCase();
    }
}
function f11(action) {
    const { kind , payload  } = action;
    if (kind === 'A') {
        payload.toFixed();
    }
    if (kind === 'B') {
        payload.toUpperCase();
    }
}
function f12({ kind , payload  }) {
    switch(kind){
        case 'A':
            payload.toFixed();
            break;
        case 'B':
            payload.toUpperCase();
            break;
        default:
            payload; // never
    }
}
function f20({ kind , payload  }) {
    if (payload) {
        if (kind === 'A') {
            payload.toFixed();
        }
        if (kind === 'B') {
            payload.toUpperCase();
        }
    }
}
function f21(action) {
    const { kind , payload  } = action;
    if (payload) {
        if (kind === 'A') {
            payload.toFixed();
        }
        if (kind === 'B') {
            payload.toUpperCase();
        }
    }
}
function f22(action) {
    if (action.payload) {
        const { kind , payload  } = action;
        if (kind === 'A') {
            payload.toFixed();
        }
        if (kind === 'B') {
            payload.toUpperCase();
        }
    }
}
function f23({ kind , payload  }) {
    if (payload) {
        switch(kind){
            case 'A':
                payload.toFixed();
                break;
            case 'B':
                payload.toUpperCase();
                break;
            default:
                payload; // never
        }
    }
}
function f30({ kind , isA  }) {
    if (kind === 'A') {
        isA; // true
    }
    if (kind === 'B') {
        isA; // false
    }
    if (kind === 'C') {
        isA; // false
    }
    if (isA) {
        kind; // 'A'
    } else {
        kind; // 'B' | 'C'
    }
}
function f40(...[kind, data]) {
    if (kind === 'A') {
        data.toFixed();
    }
    if (kind === 'B') {
        data.toUpperCase();
    }
}
function unrefined1(ab) {
    const { variant , value  } = ab;
    if (variant === 'a') {
        printValue(value);
    } else {
        printValueList(value);
    }
}
const reducerBroken = (state, { type , payload  })=>{
    switch(type){
        case 'add':
            return state + payload.toAdd;
        case 'remove':
            return state - payload.toRemove;
    }
};
const { value , done  } = it.next();
if (!done) {
    value; // number
}
f50((kind, data)=>{
    if (kind === 'A') {
        data.toFixed();
    }
    if (kind === 'B') {
        data.toUpperCase();
    }
});
const f51 = (kind, payload)=>{
    if (kind === 'A') {
        payload.toFixed();
    }
    if (kind === 'B') {
        payload.toUpperCase();
    }
};
const f52 = (kind, payload)=>{
    if (kind === 'A') {
        payload.toFixed();
    } else {
        payload; // undefined
    }
};
readFile('hello', (err, data)=>{
    if (err === null) {
        data.length;
    } else {
        err.message;
    }
});
const reducer = (op, args)=>{
    switch(op){
        case "add":
            console.log(args.a + args.b);
            break;
        case "concat":
            console.log(args.firstArr.concat(args.secondArr));
            break;
    }
};
reducer("add", {
    a: 1,
    b: 3
});
reducer("concat", {
    firstArr: [
        1,
        2
    ],
    secondArr: [
        3,
        4
    ]
});
