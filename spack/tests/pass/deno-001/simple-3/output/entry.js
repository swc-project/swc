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
console.log(deferred2, MuxAsyncIterator2);
