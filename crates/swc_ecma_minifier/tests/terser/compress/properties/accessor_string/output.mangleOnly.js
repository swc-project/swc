var b = 1;
var a = {
    get "a-b" () {
        return b;
    },
    set "a-b" (c){
        b = c;
    }
};
console.log(a["a-b"], (a["a-b"] = 2), a["a-b"]);
