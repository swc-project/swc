let receiverIndex = 0;
function f() {
    return { a: receiverIndex++ ? "1" : 1 };
}
console.log(f().a === f().a);
console.log(receiverIndex);

receiverIndex = 0;
console.log(f().a !== f().a);
console.log(receiverIndex);

const o = { a: 1 };
console.log(o.a === o.a);

const indexed = [1];
console.log(indexed[0] === indexed[0]);

const nonIdentifierKey = { "not-an-ident": 1 };
console.log(nonIdentifierKey["not-an-ident"] === nonIdentifierKey["not-an-ident"]);

let keyIndex = 0;
function key() {
    return keyIndex++ ? "string" : "number";
}
const values = { number: 1, string: "1" };
console.log(values[key()] === values[key()]);

keyIndex = 0;
console.log(values[key()] !== values[key()]);

let optionalReceiverIndex = 0;
function optionalReceiver() {
    return { a: optionalReceiverIndex++ ? "1" : 1 };
}
console.log(optionalReceiver?.().a === optionalReceiver?.().a);

let optionalKeyIndex = 0;
function optionalKey() {
    return optionalKeyIndex++ ? "string" : "number";
}
console.log(values[optionalKey?.()] === values[optionalKey?.()]);
