function deferred() {
}
class MuxAsyncIterator {
    constructor(){
        this.signal = deferred();
    }
}
const MuxAsyncIterator1 = MuxAsyncIterator, deferred1 = deferred;
console.log(deferred1, MuxAsyncIterator1);
