function deferred() {
}
const deferred1 = deferred;
const deferred2 = deferred1;
const deferred3 = deferred1;
const deferred4 = deferred3;
class MuxAsyncIterator {
    constructor(){
        this.signal = deferred2();
    }
}
class ServerRequest {
    constructor(){
        this.done = deferred4();
    }
}
const ServerRequest1 = ServerRequest;
const ServerRequest2 = ServerRequest1;
console.log(ServerRequest2);
async function writeResponse(w, r) {
}
async function readRequest(conn, bufr) {
}
const writeResponse1 = writeResponse;
const writeResponse2 = writeResponse1;
const readRequest1 = readRequest;
const readRequest2 = readRequest1;
const MuxAsyncIterator1 = MuxAsyncIterator;
const MuxAsyncIterator2 = MuxAsyncIterator1;
const MuxAsyncIterator3 = MuxAsyncIterator2;
console.log(deferred4, writeResponse2, readRequest2, MuxAsyncIterator3);
async function listenAndServe(addr, handler) {
}
const listenAndServe1 = listenAndServe;
const listenAndServe2 = listenAndServe1;
listenAndServe2({
    port: 8080
}, async (req)=>{
});
