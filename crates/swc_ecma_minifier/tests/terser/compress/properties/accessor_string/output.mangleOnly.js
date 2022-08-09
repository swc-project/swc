var a = 1;
var r = {
    get "a-b" () {
        return a;
    },
    set "a-b" (c){
        a = c;
    }
};
console.log(r["a-b"], (r["a-b"] = 2), r["a-b"]);
