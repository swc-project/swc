// declarations with call initializer
const constCall = Symbol();
let letCall = Symbol();
var varCall = Symbol();

// ambient declaration with type
declare const constType: unique symbol;

// declaration with type and call initializer
const constTypeAndCall: unique symbol = Symbol();

// function return value with type query
function funcReturnConstCallWithTypeQuery(): typeof constCall {
    return constCall;
}
