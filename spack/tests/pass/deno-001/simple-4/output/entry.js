function deferred() {
}
const deferred1 = deferred;
class MuxAsyncIterator {
    constructor(){
        this.signal = deferred1();
    }
}
const MuxAsyncIterator1 = MuxAsyncIterator;
const deferred2 = deferred1, MuxAsyncIterator2 = MuxAsyncIterator1;
console.log(deferred2, MuxAsyncIterator2);
