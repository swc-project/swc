// declarations with call initializer
const constCall = Symbol();
let letCall = Symbol();
var varCall = Symbol();

// ambient declaration with type
declare const constType: unique symbol;

// declaration with type and call initializer
const constTypeAndCall: unique symbol = Symbol();

// generator function yield inference
function* genFuncYieldConstCall() {
    yield constCall;
}

function* genFuncYieldLetCall() {
    yield letCall;
}

function* genFuncYieldVarCall() {
    yield varCall;
}

// generator function yield with return type query
function* genFuncYieldConstCallWithTypeQuery(): IterableIterator<typeof constCall> {
    yield constCall;
}
