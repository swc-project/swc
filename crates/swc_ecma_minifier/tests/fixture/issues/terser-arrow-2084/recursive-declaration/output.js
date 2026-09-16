((c)=>{
    c = 1 + c, c = 0, console.log(function f(n) {
        return n ? ++c + f(n - 1) : c;
    }(2), c);
})(-1);
