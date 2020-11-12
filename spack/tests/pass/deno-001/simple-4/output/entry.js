function deferred2() {
}
const deferred1 = deferred2;
class MuxAsyncIterator {
    constructor(){
        this.signal = deferred();
    }
}
const MuxAsyncIterator1 = MuxAsyncIterator;
const deferred3 = deferred1, MuxAsyncIterator2 = MuxAsyncIterator1;
const deferred4 = deferred3, MuxAsyncIterator3 = MuxAsyncIterator2;
console.log(deferred4, MuxAsyncIterator3);
