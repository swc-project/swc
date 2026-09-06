var c = 10;
((c)=>{
    c = 1 + c, c = 0, console.log(++c), console.log(c);
})(-1), console.log(c);
