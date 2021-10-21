new class {
    foo(x1) {
        return function(x) {
            return x;
        };
    }
    constructor(x){
    }
}({
    length: 2
}).foo({
    length: 3,
    charAt: (x)=>{
        "";
    }
})("");
