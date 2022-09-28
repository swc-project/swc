var e = 1;
var t = {
    get set () {
        return e;
    },
    set get (c){
        e = c;
    }
};
console.log(t.set, (t.get = 2), t.set);
