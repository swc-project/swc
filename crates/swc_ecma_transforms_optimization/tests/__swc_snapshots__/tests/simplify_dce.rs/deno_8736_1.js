class DenoStdInternalError1 extends Error {
    constructor(message){
        super(message);
        this.name = 'DenoStdInternalError';
    }
}
const DenoStdInternalError = DenoStdInternalError1;
function assert2(expr, msg = '') {
    if (!expr) {
        throw new DenoStdInternalError(msg);
    }
}
const assert1 = assert2;
const assert = assert1;
const TEST = Deno.env.get('TEST');
assert(TEST, 'TEST must be defined!');
console.log(`Test is ${TEST}`);
