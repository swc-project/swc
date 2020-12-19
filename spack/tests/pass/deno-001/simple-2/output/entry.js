function deferred() {
}
const deferred1 = deferred;
const deferred2 = deferred1;
const deferred3 = deferred;
const deferred4 = deferred3;
class MuxAsyncIterator {
    constructor(){
        this.signal = deferred4();
    }
}
const MuxAsyncIterator1 = MuxAsyncIterator;
const MuxAsyncIterator2 = MuxAsyncIterator1;
async function writeResponse(w, r) {
}
const writeResponse1 = writeResponse;
const writeResponse2 = writeResponse1;
async function readRequest(conn, bufr) {
}
const readRequest1 = readRequest;
const readRequest2 = readRequest1;
class ServerRequest {
    constructor(){
        this.done = deferred2();
    }
}
const ServerRequest1 = ServerRequest;
const ServerRequest2 = ServerRequest1;
async function listenAndServe(addr, handler) {
}
const listenAndServe1 = listenAndServe;
const listenAndServe2 = listenAndServe1;
console.log(deferred2, writeResponse2, readRequest2, MuxAsyncIterator2);
console.log(ServerRequest2);
listenAndServe2({
    port: 8080
}, async (req)=>{
});
