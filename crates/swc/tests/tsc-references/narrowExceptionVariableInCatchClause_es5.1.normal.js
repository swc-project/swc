import * as swcHelpers from "@swc/helpers";
function tryCatch() {
    try {
    // do stuff...
    } catch (err) {
        if (isFooError(err)) {
            err.dontPanic(); // OK
            err.doPanic(); // ERROR: Property 'doPanic' does not exist on type '{...}'
        } else if (swcHelpers._instanceof(err, Error)) {
            err.message;
            err.massage; // ERROR: Property 'massage' does not exist on type 'Error'
        } else {
            throw err;
        }
    }
}
