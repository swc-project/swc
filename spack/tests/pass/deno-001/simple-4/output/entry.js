function deferred() {
}
const deferred1 = deferred;
const deferred2 = deferred1;
const deferred3 = deferred2;
const deferred4 = deferred1;
class MuxAsyncIterator {
    constructor(){
        this.signal = deferred4();
    }
}
const MuxAsyncIterator1 = MuxAsyncIterator;
const MuxAsyncIterator2 = MuxAsyncIterator1;
const MuxAsyncIterator3 = MuxAsyncIterator2;
console.log(deferred3, MuxAsyncIterator3);
