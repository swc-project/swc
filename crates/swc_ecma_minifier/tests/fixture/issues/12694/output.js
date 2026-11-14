for(var vs = [], i = 0; i < 2; i++)(()=>{
    try {
        var x = i;
    } catch (e) {}
    vs.push(()=>x);
})(), function() {
    do var y = i;
    while (0)
    vs.push(()=>y);
}(), function() {
    for (var z of [
        i
    ]);
    vs.push(()=>z);
}(), function() {
    l: {
        var w = i;
        if (i) break l;
    }
    vs.push(()=>w);
}();
console.log(vs.map((g)=>g()).join());
