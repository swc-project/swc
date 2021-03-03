function deferred() {
}
class MuxAsyncIterator {
    constructor(){
        this.signal = deferred();
    }
}
class ServerRequest {
    constructor(){
        this.done = deferred();
    }
}
console.log(ServerRequest);
async function writeResponse(w, r) {
}
async function readRequest(conn, bufr) {
}
console.log(deferred, writeResponse, readRequest, MuxAsyncIterator);
async function listenAndServe(addr, handler) {
}
listenAndServe({
    port: 8080
}, async (req)=>{
});
