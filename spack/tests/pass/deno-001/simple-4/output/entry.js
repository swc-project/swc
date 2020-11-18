function deferred() {
}
const deferred1 = deferred;
const deferred2 = deferred1;
class MuxAsyncIterator {
    constructor(){
        this.signal = deferred2();
    }
}
const MuxAsyncIterator1 = MuxAsyncIterator;
const deferred3 = deferred1;
const MuxAsyncIterator2 = MuxAsyncIterator1;
const deferred4 = deferred3, MuxAsyncIterator3 = MuxAsyncIterator2;
console.log(deferred4, MuxAsyncIterator3);
