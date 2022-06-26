import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
function f10(param) {
    var kind = param.kind, payload = param.payload;
    if (kind === "A") {
        payload.toFixed();
    }
    if (kind === "B") {
        payload.toUpperCase();
    }
}
function f11(action) {
    var kind = action.kind, payload = action.payload;
    if (kind === "A") {
        payload.toFixed();
    }
    if (kind === "B") {
        payload.toUpperCase();
    }
}
function f12(param) {
    var kind = param.kind, payload = param.payload;
    switch(kind){
        case "A":
            payload.toFixed();
            break;
        case "B":
            payload.toUpperCase();
            break;
        default:
            payload; // never
    }
}
function f20(param) {
    var kind = param.kind, payload = param.payload;
    if (payload) {
        if (kind === "A") {
            payload.toFixed();
        }
        if (kind === "B") {
            payload.toUpperCase();
        }
    }
}
function f21(action) {
    var kind = action.kind, payload = action.payload;
    if (payload) {
        if (kind === "A") {
            payload.toFixed();
        }
        if (kind === "B") {
            payload.toUpperCase();
        }
    }
}
function f22(action) {
    if (action.payload) {
        var kind = action.kind, payload = action.payload;
        if (kind === "A") {
            payload.toFixed();
        }
        if (kind === "B") {
            payload.toUpperCase();
        }
    }
}
function f23(param) {
    var kind = param.kind, payload = param.payload;
    if (payload) {
        switch(kind){
            case "A":
                payload.toFixed();
                break;
            case "B":
                payload.toUpperCase();
                break;
            default:
                payload; // never
        }
    }
}
function f30(param) {
    var kind = param.kind, isA = param.isA;
    if (kind === "A") {
        isA; // true
    }
    if (kind === "B") {
        isA; // false
    }
    if (kind === "C") {
        isA; // false
    }
    if (isA) {
        kind; // 'A'
    } else {
        kind; // 'B' | 'C'
    }
}
function f40() {
    for(var _len = arguments.length, _tmp = new Array(_len), _key = 0; _key < _len; _key++){
        _tmp[_key] = arguments[_key];
    }
    var __tmp = _sliced_to_array(_tmp, 2), kind = __tmp[0], data = __tmp[1];
    if (kind === "A") {
        data.toFixed();
    }
    if (kind === "B") {
        data.toUpperCase();
    }
}
function unrefined1(ab) {
    var variant = ab.variant, value = ab.value;
    if (variant === "a") {
        printValue(value);
    } else {
        printValueList(value);
    }
}
var reducerBroken = function(state, param) {
    var type = param.type, payload = param.payload;
    switch(type){
        case "add":
            return state + payload.toAdd;
        case "remove":
            return state - payload.toRemove;
    }
};
var ref = it.next(), value = ref.value, done = ref.done;
if (!done) {
    value; // number
}
f50(function(kind, data) {
    if (kind === "A") {
        data.toFixed();
    }
    if (kind === "B") {
        data.toUpperCase();
    }
});
var f51 = function(kind, payload) {
    if (kind === "A") {
        payload.toFixed();
    }
    if (kind === "B") {
        payload.toUpperCase();
    }
};
var f52 = function(kind, payload) {
    if (kind === "A") {
        payload.toFixed();
    } else {
        payload; // undefined
    }
};
readFile("hello", function(err, data) {
    if (err === null) {
        data.length;
    } else {
        err.message;
    }
});
var reducer = function(op, args) {
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
