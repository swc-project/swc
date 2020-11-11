function deferred1() {
}
class MuxAsyncIterator {
    constructor(){
        this.signal = deferred();
    }
}
const deferred2 = deferred1, MuxAsyncIterator1 = MuxAsyncIterator;
console.log(deferred2, MuxAsyncIterator1);
