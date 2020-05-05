// declarations with call initializer
const constCall = Symbol();
let letCall = Symbol();
var varCall = Symbol();

// ambient declaration with type
declare const constType: unique symbol;

// declaration with type and call initializer
const constTypeAndCall: unique symbol = Symbol();

// async function return inference
async function asyncFuncReturnConstCall() {
    return constCall;
}

async function asyncFuncReturnLetCall() {
    return letCall;
}

async function asyncFuncReturnVarCall() {
    return varCall;
}

// async generator function yield inference
async function* asyncGenFuncYieldConstCall() {
    yield constCall;
}

async function* asyncGenFuncYieldLetCall() {
    yield letCall;
}

async function* asyncGenFuncYieldVarCall() {
    yield varCall;
}
