function deferred() {
}
const deferred1 = deferred;
class MuxAsyncIterator {
    constructor(){
        this.signal = deferred();
    }
}
const MuxAsyncIterator1 = MuxAsyncIterator;
console.log(deferred1, MuxAsyncIterator1);
