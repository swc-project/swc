function deferred() {
}
class MuxAsyncIterator {
    constructor(){
        this.signal = deferred();
    }
}
console.log(deferred, MuxAsyncIterator);
