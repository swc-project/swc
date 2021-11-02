var tmp = Symbol.iterator;
//@target: ES6
class StringIterator {
    next() {
        return {
            done: false,
            value: ""
        };
    }
    [tmp]() {
        return this;
    }
    constructor(){
        this.return = 0;
    }
}
for (var v of new StringIterator){
}
