class DenoStdInternalError extends Error {
    constructor(message){
        super(message);
        this.name = 'DenoStdInternalError';
    }
}
function assert(expr, msg = '') {
    throw new DenoStdInternalError(msg);
}
const TEST = Deno.env.get('TEST');
assert(TEST, 'TEST must be defined!');
console.log(`Test is ${TEST}`);
