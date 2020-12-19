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
const MuxAsyncIterator1 = MuxAsyncIterator;
const MuxAsyncIterator2 = MuxAsyncIterator1;
const MuxAsyncIterator3 = MuxAsyncIterator2;
console.log(deferred4, MuxAsyncIterator3);
