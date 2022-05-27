var b = 1;
var a = {
    get set () {
        return b;
    },
    set get (c){
        b = c;
    }
};
console.log(a.set, (a.get = 2), a.set);
