var t = 1;
var e = {
    get set () {
        return t;
    },
    set get (c){
        t = c;
    }
};
console.log(e.set, (e.get = 2), e.set);
