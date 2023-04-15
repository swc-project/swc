function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function deferred() {}
class MuxAsyncIterator {
    constructor(){
        _define_property(this, "signal", deferred());
    }
}
class ServerRequest {
    constructor(){
        _define_property(this, "done", deferred());
    }
}
console.log(ServerRequest);
async function writeResponse(w, r) {}
async function readRequest(conn, bufr) {}
console.log(deferred, writeResponse, readRequest, MuxAsyncIterator);
async function listenAndServe(addr, handler) {}
listenAndServe({
    port: 8080
}, async (req)=>{});
