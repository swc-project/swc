for(var vs = [], i = 0; i < 2; i++)!function() {
    for(var k = 0; k++ < 1;)var x = i;
    vs.push(()=>x);
}();
console.log(vs.map((g)=>g()).join());
