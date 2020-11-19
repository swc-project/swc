function deferred() {
}
const deferred1 = deferred;
const deferred2 = deferred1;
class MuxAsyncIterator {
    constructor(){
        this.signal = deferred2();
    }
}
const deferred3 = deferred;
const MuxAsyncIterator1 = MuxAsyncIterator;
const deferred4 = deferred3;
const MuxAsyncIterator2 = MuxAsyncIterator1;
class ServerRequest {
    constructor(){
        this.done = deferred4();
    }
}
async function listenAndServe(addr, handler) {
}
const ServerRequest1 = ServerRequest;
const listenAndServe1 = listenAndServe;
const ServerRequest2 = ServerRequest1;
console.log(ServerRequest2);
async function writeResponse(w, r) {
}
async function readRequest(conn, bufr) {
}
const writeResponse1 = writeResponse;
const readRequest1 = readRequest;
const writeResponse2 = writeResponse1;
const readRequest2 = readRequest1;
console.log(deferred4, writeResponse2, readRequest2, MuxAsyncIterator2);
const listenAndServe2 = listenAndServe1;
listenAndServe2({
    port: 8080
}, async (req)=>{
});
